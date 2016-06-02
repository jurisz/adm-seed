

Required:

1. java 8
2. postgres 9.4
3. niginx

4. Install NodeJS with NPM (node 5+ is requried),
   at least on Linux you'll also may need nodejs-devel.
   install gulp globaly
   npm install -g gulp
   

5. create postgres test user and db with
     support/create-test-user-db.sql
   
6. build first time

./gradlew npmInstall build