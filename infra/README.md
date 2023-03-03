#INFRASTRUCTURE FOLDER

This folder should be moved to the root folder where all the services are located.

Replace all the key-value pairs with yours

- `k8s` folder contains all production kubernetes manifests
- `k8s-dev` folder contains all development kubernetes manifests to run with skaffold
- `scripts` folder contains all script related to the creation of a cluster or running skaffold or secret creation

## Skaffold File

For production environment: `./k8s/skaffold.yaml`

For development environment: `./k8s-dev/skaffold.yaml`

Remember to put this file in the root of multi-services project. Depending on the environment, you should specify the
correct skaffold configuration.

- If you use Docker, you should install NGINX at this link
  [NGINX x Docker](https://kubernetes.github.io/ingress-nginx/deploy/)

## TASK TO MAKE THIS WORK

1. Create a project in GCP
2. Go to `./scripts/gke-autopilot.sh` and change the <google-cloud-project-id> with your project id.
3. Launch the script with `chmod +x gke-autopilot.sh && ./gke-autopilot.sh`
4. Just in case context is not changed, you should change with `kubectl config use-context <clustern-name>`
5. Put the file `skaffold.yaml` in your root folder where all the services are located.
6. For each YAML file change the `project-id`, `servicename` and all other env variables with your
7. After you changed all the configuration files you can launch skaffold command with `skaffold run`

## USEFUL COMANDS

- Change the context of kubernetes

```bash
kubectl config use-context <clustern-name>
```

- Build the container in gcloud with the command. In the root where Dockerfile is located

```bash
gcloud builds submit --tag gcr.io/<gcp-project-id>/<image-name> .
```

- CREATE SECRET FROM JSON FILE
  - google-application-credentials = the name of the secret to be stored
  - google-application-credentials.json = the file name and the file will be stored in a volume
  - ./google-application-credentials.json = the actual file downloaded and that is in the config folder

```bash
kubectl create secret generic google-application-credentials --from-file=google-application-credentials.json=./google-application-credentials.json
```
