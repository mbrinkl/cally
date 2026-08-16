Sync to apple calendar / contacts to display calendar events + contact birthdays.

1. curl https://raw.githubusercontent.com/mbrinkl/cally/main/docker-compose.yml -o docker-compose.yml
2. curl https://raw.githubusercontent.com/mbrinkl/cally/main/.env.example -o .env
3. update .env file with apple credentials (use an [app-specific password](https://support.apple.com/en-us/102654))
4. docker-compose up
