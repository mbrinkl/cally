Sync to apple calendar / contacts to display calendar events + contact birthdays.

### Setup

1. curl https://raw.githubusercontent.com/mbrinkl/cally/main/compose.yaml -o compose.yaml
2. curl https://raw.githubusercontent.com/mbrinkl/cally/main/.env.example -o .env
3. update .env file with apple credentials (use an [app-specific password](https://support.apple.com/en-us/102654))
4. docker compose up

### Env

**Server**

APPLE_USERNAME=`apple email`

APPLE_APP_PASSWORD=`apple app password`

CALENDAR_IDS=`comma-separated ids of calendars to include`

EXTERNAL_ICAL_URLS=`comma-separated urls of external iCal calendars`

**UI**

COLOR_SCHEME=`light (default) | dark`

CALENDAR_COLORS=`comma-separated list of colors, maps 1-to-1 with CALENDAR_IDS`

BIRTHDAYS_COLOR=`a color`

EXTERNAL_ICAL_COLORS=`comma-separated list of colors, maps 1-to-1 with EXTERNAL_ICAL_URLS`
