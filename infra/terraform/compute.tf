resource "google_container_cluster" "app_cluster" {
  name     = "${var.app_name}-cluster-${var.environment}"
  location = var.region
  ip_allocation_policy {
  }
  enable_autopilot = true
}

resource "google_compute_global_address" "external_static_ip" {
  name         = "${var.app_name}-ingress-static-ip"
  address_type = "EXTERNAL"
  ip_version   = "IPV4"
  project      = var.project
  description  = "External static IP address for app"
}

output "external_static_ip" {
  value       = google_compute_global_address.external_static_ip.address
  description = "External static IP address for app"
}
