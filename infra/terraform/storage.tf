resource "google_storage_bucket" "prod-bucket" {
  name                        = "${var.app_name}-bucket-${var.environment}"
  location                    = var.region
  project                     = var.project
  storage_class               = "STANDARD"
  uniform_bucket_level_access = false
  # versioning {
  #   enabled = true
  # }
  # lifecycle_rule {
  #   action {
  #     type          = "Delete"
  #     storage_class = "NEARLINE"
  #   }
  #   condition {
  #     age = 30
  #   }
  # }
}

output "prod_bucket_name" {
  value       = google_storage_bucket.prod-bucket.name
  description = "Prod Bucket name"
}
