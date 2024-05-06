# ArgoVenture

ArgoVenture is a web application designed to connect users with a variety of projects and opportunities. It allows users to sign up, log in, and participate in community-driven initiatives.


## Installation

To install ArgoVenture, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/Sirraff/ArgoVenture.git
   ```
2. Navigate to the project directory:
   ```
   cd argoventure
   ```
3. Install the necessary dependencies:
   ```
   npm install
   npm install express ejs
   npm install mysql
   npm install express-session
   npm install body-parser
   npm install firebase-admin
   ```
4. Environment Configuration(TO DO)
   For managing environment-specific settings, such as API keys, install dotenv:
   ```
   npm install dotenv
   ```
   Create a .env file in your project root and store your configurations like this:
   ```
   API_KEY=your_api_key_here
   ```
   

## Usage

To run ArgoVenture, execute the following command in the root of the project:

```
node index.js
```

This will start the server on \`http://localhost:3000\`. Navigate to this address in your web browser to use the application.

## Features

- User authentication (sign up and log in)
- Integration with Firebase for secure and reliable user management
- Responsive design for a seamless experience on both desktop and mobile devices

## Contributing

Contributions to ArgoVenture are welcome. To contribute:

1. Fork the repository.
2. Create a new branch (```git checkout -b feature-branch```).
3. Make your changes.
4. Commit your changes (```git commit -am 'Add some feature'```).
5. Push to the branch (```git push origin feature-branch```).
6. Create a new Pull Request.

## Authors
Rafael L.S Reis - rafael.ls.reis@gmail.com

Rayan Hamid - rayanhamid345@gmail.com

Moe Karaki - momokaraki@gmail.com

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
