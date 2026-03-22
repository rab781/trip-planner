## 2024-05-09 - [Missing SSL Verification in cURL]
**Vulnerability:** Found a lack of explicit SSL certificate verification (`CURLOPT_SSL_VERIFYPEER` and `CURLOPT_SSL_VERIFYHOST`) in native cURL streaming requests to external APIs (e.g., Chutes AI).
**Learning:** By default, PHP's cURL extension verifies SSL certificates, but it is best practice to explicitly enforce it to prevent potential Man-In-The-Middle (MITM) attacks and ensure it's not accidentally disabled by server configurations or later code modifications.
**Prevention:** Always explicitly set `CURLOPT_SSL_VERIFYPEER => true` and `CURLOPT_SSL_VERIFYHOST => 2` when making HTTPS requests using native `curl_init` instead of relying on environment defaults.
