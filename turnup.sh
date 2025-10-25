#!/bin/bash
# GCP auth
gcloud auth application-default login
gcloud config set project danmage

# Create the builder service account
gcloud iam service-accounts create web-builder

# Grant permissions to the builder service account
gcloud projects add-iam-policy-binding danmage --member="serviceAccount:web-builder@danmage.iam.gserviceaccount.com" --role='roles/cloudbuild.builds.builder' --condition=None
gcloud projects add-iam-policy-binding danmage --member="serviceAccount:web-builder@danmage.iam.gserviceaccount.com" --role='roles/container.developer' --condition=None
gcloud projects add-iam-policy-binding danmage --member="serviceAccount:web-builder@danmage.iam.gserviceaccount.com" --role='roles/compute.instanceAdmin.v1' --condition=None

# Grant permissions to the default compute engine service account
gcloud projects add-iam-policy-binding danmage --member="serviceAccount:783644681124-compute@developer.gserviceaccount.com" --role='roles/datastore.user' --condition=None

# Create VM instance
gcloud compute instances create danmage-web --project=danmage --zone=us-west1-b --machine-type=e2-micro --tags=http-server,https-server --image-family=cos-stable --image-project=cos-cloud --metadata-from-file=startup-script=vm_startup_script.sh --scopes=https://www.googleapis.com/auth/cloud-platform --address=web-server-ip
