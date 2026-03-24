## 2025-02-14 - [Critical] Explicit SSL Verification in cURL

**Vulnerability:** Missing explicit SSL verification settings (`CURLOPT_SSL_VERIFYPEER` and `CURLOPT_SSL_VERIFYHOST`) in cURL requests within the application, specifically in `ChatController.php` calling the Chutes API.
**Learning:** Default PHP cURL settings do not universally enforce SSL certificate validation, which can silently allow Man-in-the-Middle (MITM) attacks. This codebase requires explicit assignment to `true` and `2`, respectively, to ensure security.
**Prevention:** Always enforce SSL verification by adding `CURLOPT_SSL_VERIFYPEER => true` and `CURLOPT_SSL_VERIFYHOST => 2` to all `curl_setopt_array` configurations.
## 2024-05-24 - [High] Missing explicit SSL verification in cURL API requests
**Vulnerability:** External API calls (Chutes AI integration) using raw `curl_init` did not explicitly enforce `CURLOPT_SSL_VERIFYPEER` or `CURLOPT_SSL_VERIFYHOST`. By default, PHP cURL usually verifies peers, but it can be overridden in `php.ini` or by OS-level cURL changes. Relying on defaults is a potential security risk leading to Man-in-the-Middle (MitM) attacks.
**Learning:** In legacy or highly configured environments, standard tools might have insecure default configurations. Directly using cURL bypasses Laravel `Http::` wrapper protections and defaults. The `ChatController::sendMessageStream` implementation opted for raw cURL for streaming capabilities but missed the explicit security config.
**Prevention:** Always explicitly set `CURLOPT_SSL_VERIFYPEER => true` and `CURLOPT_SSL_VERIFYHOST => 2` when writing custom cURL requests. Prefer using Laravel's robust `Http` facade where possible, even for advanced use cases if supported.
