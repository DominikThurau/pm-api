# PM-API

## Setup the project
### Make sure your Docker-Desktop is running

1. clone the project
2. rename .env.dist to .env
3. run docker-compose build
4. run docker-compose up

##### -> Now you should be able to call http://localhost:4000/projects
In der Oberfläche kann jetzt ein neues Projekt angelegt werden.

Damit die Endpunkte funktionieren müssen alle IDs eines Projekts den Wert ***951*** haben (GitLab, Cogo, DIAS)!

Sollte es zu Problemen kommen, wie dass keine Projekte in die Datenbank gespeichert werden können, könnte dies daran liegen, dass die Datenbank nicht korrekt erstellt wurde. Dies kann über MongoDB-Compass überprüft werden. Bei Bedarf kann diese auch manuell angelegt werden. 

- **Datenbank:** pm-api
- **Collection:** projects
