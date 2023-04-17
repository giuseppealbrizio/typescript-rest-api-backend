REMEMBER TO ADD A FILE CALLED `terraform.tfvars` with the following options:

with the following options

```
region      = "europe-west1"
zone        = "europe-west1-b"
location    = "EU"
project     = "development-test-skeldon"
environment = "prod"
app_name    = "test-rest-api-app"
```

Then run terraform commands as usual.

## Terraform commands could be:

```bash
terraform init # only the first time
terraform fmt # to format the code
terraform validate # to validate the code
terraform plan # to see what will be created
terraform apply # to create the infrastructure
```
