# Распределение портов

|                              Service                             | Main  | Dev   |
|------------------------------------------------------------------|-------|-------|
| [WMS](https://gitlab.com/relife-eco/nstu/wms)                    | 1312  | 1313  |
| [WebApp](https://gitlab.com/relife-eco/nstu/webapp-shop)         | 1314  | 1315  |
| [TgBot](https://gitlab.com/relife-eco/nstu/telegram-bot)         | 1316  | 1317  |
| [PMT](https://gitlab.com/relife-eco/nstu/pmt)                    | 1318  | 1319  |
| [SSO](https://gitlab.com/relife-eco/nstu/authentication-service) | 1320  | 1321  |

# Распределение доменов

|                              Service                             |         Main       |          Dev          |
|------------------------------------------------------------------|--------------------|-----------------------|
| [WMS](https://gitlab.com/relife-eco/nstu/wms)                    | wms.relife-eco.ru  | devwms.relife-eco.ru  |
| [WebApp](https://gitlab.com/relife-eco/nstu/webapp-shop)         | app.relife-eco.ru  | devapp.relife-eco.ru  |
| [TgBot](https://gitlab.com/relife-eco/nstu/telegram-bot)         | bot.relife-eco.ru  | devbot.relife-eco.ru  |
| [PMT](https://gitlab.com/relife-eco/nstu/pmt)                    | pmt.relife-eco.ru  | devpmt.relife-eco.ru  |
| [SSO](https://gitlab.com/relife-eco/nstu/authentication-service) | auth.relife-eco.ru | devauth.relife-eco.ru |

# Примерная необходимая инфраструктура

```mermaid
graph TD
    subgraph WMS 
        WMS[Сервис WMS]
        PostgreSQL_WMS[PostgreSQL]
        Redis_WMS[Redis]
    end

    subgraph Authentication Service
        Auth[Сервис Аутентификации]
        Redis_Auth[Redis]
    end

    subgraph WebApp_Service
        WebApp[TG MiniApp]
        Redis_WebApp[Redis]
    end

    subgraph Telegram bot dervice
        Bot[Telegram Чат-бот]
    end

    subgraph Project Management Tool
        PMT[Замена Redmine]
        PostgreSQL_PMT[PostgreSQL]
        Redmine[Redis]
    end

    subgraph Kafka 
        Kafka[Kafka]
    end

    WMS --- Redis_WMS
    Redis_WMS --- PostgreSQL_WMS
    WMS --- Auth
    Redis_WebApp --- PostgreSQL_WMS 

    Auth --- Redis_Auth
    PMT --- Auth 

    WebApp --- Redis_WebApp
    WebApp --- Kafka
    Bot --- WebApp 

    PMT --- Redmine
    PostgreSQL_PMT --- Redmine

    Kafka --- WMS
    Kafka --- PMT
