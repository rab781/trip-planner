<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatController extends Controller
{
    public function sendMessage(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
            'conversation_history' => 'nullable|array'
        ]);

        $userMessage = $request->input('message');
        $conversationHistory = $request->input('conversation_history', []);

        // System prompt untuk chatbot pemandu wisata profesional
        $systemPrompt = "Anda adalah pemandu wisata senior berpengalaman 15 tahun bernama 'Andi' yang bekerja untuk Serute. Spesialisasi: wisata Bandung dan Indonesia.

ATURAN PENTING:
⚠️ JANGAN gunakan tag <think>, <thinking>, atau tag XML apapun dalam response
⚠️ Langsung berikan jawaban final yang bersih dan siap dibaca user

GAYA KOMUNIKASI:
- Singkat, padat, jelas - maksimal 150 kata
- Profesional tapi ramah
- Langsung to the point, tidak bertele-tele
- Gunakan bahasa Indonesia casual-formal
- 1-2 emoji saja per response (jangan berlebihan)

FORMAT JAWABAN:
- Langsung jawab pertanyaan
- Jika perlu list, gunakan format:
  1. Item pertama
  2. Item kedua
  (atau gunakan bullet • untuk list tanpa nomor)
- Sertakan info praktis: harga perkiraan, waktu kunjungan, tips
- Jika user tanya fitur Serute (itinerary otomatis, budget calculator), singkat ajak login

TOPIK YANG DIJAWAB:
✓ Destinasi wisata (lokasi, harga tiket, jam buka)
✓ Kuliner lokal (rekomendasi tempat, harga rata-rata)
✓ Transport (jenis, estimasi biaya)
✓ Akomodasi (range harga, lokasi strategis)
✓ Tips perjalanan (cuaca, waktu terbaik berkunjung)

TIDAK DIJAWAB:
✗ Politik, agama, atau isu sensitif
✗ Pertanyaan di luar konteks wisata

Contoh jawaban profesional:
User: \"Wisata di Bandung?\"
Anda: \"Top 5 destinasi Bandung:

1. Tangkuban Perahu (Rp50K, 08:00-17:00) - kawah vulkanik
2. Dusun Bambu (Rp25K, 09:00-21:00) - wisata keluarga
3. Farmhouse Lembang (Rp30K) - spot foto Eropa
4. Floating Market (Rp20K) - kuliner + pasar apung
5. Tebing Keraton (Gratis) - sunrise terbaik

Tips: Weekday lebih sepi, bawa jaket (dingin). Mau itinerary lengkap? Login di Serute! 🗺️\"

PENTING: Jangan panjang lebar. Langsung jawab inti pertanyaan. JANGAN gunakan tag thinking atau tag apapun!";

        // Prepare messages untuk API
        $messages = [
            [
                'role' => 'system',
                'content' => $systemPrompt
            ]
        ];

        // Add conversation history (max 10 messages untuk context)
        $historyLimit = array_slice($conversationHistory, -10);
        foreach ($historyLimit as $msg) {
            $messages[] = [
                'role' => $msg['sender'] === 'user' ? 'user' : 'assistant',
                'content' => $msg['text']
            ];
        }

        // Add current user message
        $messages[] = [
            'role' => 'user',
            'content' => $userMessage
        ];

        try {
            // Validate API token
            $apiToken = env('CHUTES_API_TOKEN');
            if (empty($apiToken)) {
                Log::error('Chutes AI API Token not configured');
                return response()->json([
                    'success' => false,
                    'message' => 'Chatbot belum dikonfigurasi dengan benar. Hubungi administrator.'
                ], 500);
            }

            // Call Chutes AI API
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiToken,
                'Content-Type' => 'application/json'
            ])->timeout(30)->post('https://llm.chutes.ai/v1/chat/completions', [
                'model' => 'Qwen/Qwen3-32B',
                'messages' => $messages,
                'stream' => false,
                'max_tokens' => 500, // Increased untuk response lengkap
                'temperature' => 0.5
            ]);

            // Log response for debugging
            Log::info('Chutes AI Response Status', ['status' => $response->status()]);

            if ($response->successful()) {
                $data = $response->json();

                // Log full response structure for debugging
                Log::info('Chutes AI Response Data', ['data_keys' => array_keys($data)]);

                // Try to extract message with multiple fallbacks
                $rawMessage = null;

                if (isset($data['choices'][0]['message']['content'])) {
                    $rawMessage = $data['choices'][0]['message']['content'];
                } elseif (isset($data['choices'][0]['text'])) {
                    $rawMessage = $data['choices'][0]['text'];
                } elseif (isset($data['message'])) {
                    $rawMessage = $data['message'];
                } elseif (isset($data['content'])) {
                    $rawMessage = $data['content'];
                }

                if (empty($rawMessage)) {
                    Log::error('Chutes AI - No message content found', [
                        'response_structure' => json_encode($data)
                    ]);
                    return response()->json([
                        'success' => false,
                        'message' => 'Maaf, format response dari AI tidak sesuai. Silakan coba lagi.'
                    ], 500);
                }

                // Clean up response
                $assistantMessage = $this->cleanAiResponse($rawMessage);

                return response()->json([
                    'success' => true,
                    'message' => $assistantMessage,
                    'usage' => $data['usage'] ?? null
                ]);
            } else {
                Log::error('Chutes AI API Error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'headers' => $response->headers()
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Maaf, layanan chatbot sedang mengalami gangguan. Silakan coba beberapa saat lagi.'
                ], 500);
            }
        } catch (\Exception $e) {
            Log::error('Chat API Exception', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan pada sistem. Silakan coba lagi.'
            ], 500);
        }
    }

    // Alternative method with streaming support (advanced)
    public function sendMessageStream(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
            'conversation_history' => 'nullable|array'
        ]);

        $userMessage = $request->input('message');
        $conversationHistory = $request->input('conversation_history', []);

        $systemPrompt = "Kamu adalah asisten pemandu wisata bernama 'Serute AI Assistant'. Bantu wisatawan dengan ramah dan informatif. Gunakan emoji yang sesuai. Jawab dalam bahasa Indonesia.";

        $messages = [
            ['role' => 'system', 'content' => $systemPrompt]
        ];

        foreach (array_slice($conversationHistory, -10) as $msg) {
            $messages[] = [
                'role' => $msg['sender'] === 'user' ? 'user' : 'admin',
                'content' => $msg['text']
            ];
        }

        $messages[] = ['role' => 'user', 'content' => $userMessage];

        return response()->stream(function () use ($messages) {
            $ch = curl_init('https://llm.chutes.ai/v1/chat/completions');

            curl_setopt_array($ch, [
                CURLOPT_POST => true,
                CURLOPT_HTTPHEADER => [
                    'Authorization: Bearer ' . env('CHUTES_API_TOKEN'),
                    'Content-Type: application/json'
                ],
                CURLOPT_POSTFIELDS => json_encode([
                    'model' => 'Qwen/Qwen3-32B',
                    'messages' => $messages,
                    'stream' => true,
                    'max_tokens' => 1000,
                    'temperature' => 0.7
                ]),
                CURLOPT_WRITEFUNCTION => function ($ch, $data) {
                    echo $data;
                    if (ob_get_level() > 0) {
                        ob_flush();
                    }
                    flush();
                    return strlen($data);
                }
            ]);

            curl_exec($ch);
            curl_close($ch);
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'X-Accel-Buffering' => 'no'
        ]);
    }

    /**
     * Clean AI response from unwanted tags and format issues
     * Keep bold formatting and emojis for better readability
     */
    private function cleanAiResponse(string $response): string
    {
        // Remove <think>, <thingk>, <thinking> tags and their content (case insensitive)
        $cleaned = preg_replace('/<think[^>]*>.*?<\/think>/is', '', $response);
        $cleaned = preg_replace('/<thingk[^>]*>.*?<\/thingk>/is', '', $cleaned);
        $cleaned = preg_replace('/<thinking[^>]*>.*?<\/thinking>/is', '', $cleaned);

        // Remove any remaining HTML/XML tags (except common text)
        $cleaned = strip_tags($cleaned);

        // Clean up multiple line breaks (max 2 consecutive untuk paragraf spacing)
        $cleaned = preg_replace('/\n{3,}/', "\n\n", $cleaned);

        // Fix bullet points formatting - ensure consistent spacing
        $cleaned = preg_replace('/^[\s]*[-·▪︎▸►]\s*/m', '• ', $cleaned);

        // Fix numbered lists - ensure consistent format
        $cleaned = preg_replace('/^[\s]*(\d+)[\.\)]\s*/m', '$1. ', $cleaned);

        // Trim leading/trailing whitespace
        $cleaned = trim($cleaned);

        // Remove excessive spaces between words (but preserve single spaces)
        $cleaned = preg_replace('/[ \t]{2,}/', ' ', $cleaned);

        // Remove spaces before punctuation
        $cleaned = preg_replace('/\s+([.,!?;:])/', '$1', $cleaned);

        // Emoji dan bold markdown (**text**) tetap dipertahankan untuk readability
        return $cleaned;
    }
}
