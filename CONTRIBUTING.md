# Contributing to x-forge

First off, thank you for considering contributing to x-forge! We welcome any contributions, from minor bug fixes to new features. Every bit helps, and we appreciate your effort.

## How to Contribute

1.  **Fork the Repository:** Create a fork of this repository to your own GitHub account.
2.  **Create a New Branch:** From the `main` branch, create a new branch for your work (`git checkout -b feature/your-feature-name`).
3.  **Make Your Changes:** Implement your changes, whether it's a bug fix or a new feature.
4.  **Commit Your Changes:** Commit your changes with a clear and descriptive message (`git commit -m "feat: Add new awesome feature"`).
5.  **Push to Your Branch:** Push your changes to your forked repository (`git push origin feature/your-feature-name`).
6.  **Create a Pull Request:** Open a pull request from your branch to the `main` branch of the original repository.

## Contribution Guidelines

- **Code Style:** Please ensure your code follows the existing code style. This project uses ESLint and Prettier to maintain code consistency.
- **Commit Messages:** Use clear and descriptive commit messages. We encourage the use of [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
- **Reporting Bugs:** If you find a bug, please create a new issue in the repository with a clear description of the problem and steps to reproduce it.
- **Suggesting Features:** If you have an idea for a new feature, please create a new issue to discuss it before you start working on it.

## Running the Project Locally

To run this project locally, you'll need Node.js and a package manager like npm, Yarn, pnpm, or Bun.

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/quasar-x1/x-forge.git
    cd x-forge
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

3.  **Run Commands:**
    You can run the CLI commands using `ts-node`:
    ```bash
    npx ts-node src/cli/index.ts --help
    ```

Thank you for your contribution!
