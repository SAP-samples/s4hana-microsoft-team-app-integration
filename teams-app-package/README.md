# How to use Developer Preview
* Change manifest.json
* Restart MS Teams with the developer preview setting
* Reference https://docs.microsoft.com/en-us/microsoftteams/platform/resources/schema/manifest-schema

## Normal manifest.json
```json
{
  "$schema": "https://developer.microsoft.com/en-us/json-schemas/teams/v1.8/MicrosoftTeams.schema.json",
  "manifestVersion": "1.8"
}
```

## Developer Preview manifest.json
```json
{
  "$schema": "https://raw.githubusercontent.com/OfficeDev/microsoft-teams-app-schema/preview/DevPreview/MicrosoftTeams.schema.json",
  "manifestVersion": "devPreview"
}
```