Make short, totally not suspicious links. https://sus.picio.us

## Requirements

- Internet connected machine accessible externally, via ip address or hostname
- sudo privileges
- npm
- Docker

## Quick start

### Development

- Set up frontend
```
git clone https://github.com/faithcsc/url-shortener
cd url-shortener
npm install
npm start
```

- Set up backend

```
git clone https://github.com/faithcsc/rest-api-tutorial
docker-compose build
docker-compose up
```

### Production

- Allow ports 443, 8443, and 8080 on your remote server's firewall: [How To Set Up a Firewall with UFW on Ubuntu 18.04](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-firewall-with-ufw-on-ubuntu-18-04)

#### Frontend

- Within `url-shortener`, modify `src/shared/config.js` and replace the following line with your domain:
```
} else {
  config.DB_ENDPOINTS = {
    base: 'https://your_domain.com:8443',
  };
}
```

- (Remote server) Set up nginx with SSL: [How To Deploy a React Application with Nginx on Ubuntu 20.04](https://www.digitalocean.com/community/tutorials/how-to-deploy-a-react-application-with-nginx-on-ubuntu-20-04)

- Check that your application is up by visiting https://your_domain.com.

#### Backend

- Copy `rest-api-tutorial` to your remote server:
```
scp -r rest-api-tutorial $user:$remote_server:/root/
```

- Build docker containers and enable it on startup:
```
docker-compose build
docker-compose up -d
```

- Restart your server to ensure the docker containers start on startup:
```
sudo reboot
docker container ls
```

## Resources

- Backend: [Creating a Secure REST API in Node.js](https://www.toptal.com/nodejs/secure-rest-api-in-nodejs)

- Deployment:

  - [How To Set Up a Firewall with UFW on Ubuntu 18.04](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-firewall-with-ufw-on-ubuntu-18-04)

  - [How To Deploy a React Application with Nginx on Ubuntu 20.04](https://www.digitalocean.com/community/tutorials/how-to-deploy-a-react-application-with-nginx-on-ubuntu-20-04)

  - [Running docker-compose on system startup](https://stackoverflow.com/questions/43671482/how-to-run-docker-compose-up-d-at-system-start-up)

- User authentication: [The Complete Guide to React User Authentication with Auth0](https://auth0.com/blog/complete-guide-to-react-user-authentication/)