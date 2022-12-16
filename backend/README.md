# Develop

```
npm install
npm start
```

# Destinations & Connectivity

```
cf create-service destination lite sap-graph-destination
cf create-service connectivity lite sap-graph-connectivity
cf create-service xsuaa application sap-graph-xsuaa-demo -c "{\"xsappname\": \"sap-graph-connectivity\", \"tenant-mode\": \"dedicated\"}"
```

cf create-service xsuaa application service-xsuaa -c ./xs-security.json

cf create-service xsuaa application ms-teams-us10-xsuaa -c "{\"xsappname\": \"ms-teams-us10-connectivity\", \"tenant-mode\": \"dedicated\"}"
cf create-service destination lite ms-teams-us10-destination
cf create-service application-logs lite ms-teams-us10-app-logger
cf create-service xsuaa application ms-teams-us10-xsuaa -c ./xs-security.json

# Deploy

```
cf api https://api.cf.us20.hana.ondemand.com/
cf login
cf push
```

# SAP Service Cloud - Cloud for Customer (C4C) Documents

- [OData API v2 Reference](https://help.sap.com/doc/d0f9ba822c08405da7d88174b304df84/CLOUD/en-US/index.html)
- [SAP API Business Hub > SAP Cloud for Customer](https://api.sap.com/package/C4C/overview)
