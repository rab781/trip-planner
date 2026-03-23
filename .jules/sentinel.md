## 2025-02-14 - [Critical] Explicit SSL Verification in cURL

**Vulnerability:** Missing explicit SSL verification settings (`CURLOPT_SSL_VERIFYPEER` and `CURLOPT_SSL_VERIFYHOST`) in cURL requests within the application, specifically in `ChatController.php` calling the Chutes API.
**Learning:** Default PHP cURL settings do not universally enforce SSL certificate validation, which can silently allow Man-in-the-Middle (MITM) attacks. This codebase requires explicit assignment to `true` and `2`, respectively, to ensure security.
**Prevention:** Always enforce SSL verification by adding `CURLOPT_SSL_VERIFYPEER => true` and `CURLOPT_SSL_VERIFYHOST => 2` to all `curl_setopt_array` configurations.
