resource "google_artifact_registry_repository" "repo" {
  location      = "europe-west1"
  repository_id = "${var.app_name}-artifact-repository"
  description   = "Artifact repository created by Terraform"
  format        = "DOCKER"
}

output "artifact_registry_name" {
  value       = google_artifact_registry_repository.repo.name
  description = "Artifact registry name"
}
  