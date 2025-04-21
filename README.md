<!-- HEADER STYLE: CLASSIC -->
<div align="center">

<img src="https://www.mentra.tech/logo-light.svg" width="30%" style="position: relative; top: 0; right: 0;" alt="Project Logo"/>

<em></em>

<!-- BADGES -->
<!-- local repository, no metadata badges. -->

<em>Built with the tools and technologies:</em>

<img src="https://img.shields.io/badge/pnpm-CB3837.svg?style=flat-square&logo=pnpm&logoColor=white" alt="pnpm">
<img src="https://img.shields.io/badge/React-61DAFB.svg?style=flat-square&logo=React&logoColor=black" alt="React">
<img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat-square&logo=TypeScript&logoColor=white" alt="TypeScript">
<img src="https://img.shields.io/badge/Zod-3E67B1.svg?style=flat-square&logo=Zod&logoColor=white" alt="Zod">
<img src="https://img.shields.io/badge/React%20Hook%20Form-EC5990.svg?style=flat-square&logo=React-Hook-Form&logoColor=white" alt="React%20Hook%20Form">

</div>
<br clear="right">

## 🔗 Table of Contents

- [📍 Overview](#-overview)
- [👾 Features](#-features)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
  - [☑️ Prerequisites](#-prerequisites)
  - [⚙️ Installation](#-installation)
  - [🤖 Usage](#🤖-usage)
- [🔰 Contributing](#-contributing)

## 📍 Overview

**Mentra** is an innovative platform designed to help reduce dropout rates in vocational and academic training across Switzerland. By combining psychology, data science, and user-centered design, the platform offers tools to help individuals better understand their career orientation and make informed decisions about their future.

The first service available is a **RIASEC-based interest assessment**. Users can evaluate their personal interests and receive tailored suggestions for professions that match their unique profiles. In addition, experts can assess and label job profiles using the RIASEC model, helping bridge the gap between personal aspirations and market realities.

This project aims to support career guidance professionals, educators, and individuals in finding more meaningful and sustainable educational and career pathways.

## 👾 Features

- 🎯 **RIASEC Interest Evaluation**: Users complete a personalized questionnaire to identify their vocational interest type.
- 🧭 **Career Suggestions**: Based on RIASEC profiles, the system recommends matching professions.
- 🧑‍💼 **Expert Job Profiling**: Career specialists can evaluate job roles and assign RIASEC codes to them.

## 🎥 Demo

Check out the live demo here:  👉 [mentra.tech](https://www.mentra.tech)

## 🖼️ Screenshots

<p align="center">
  <img src="/public/interest-assessment-demo.png" width="75%" alt="Mentra Interest Assessment" />
  <br>
  <em>RIASEC assessment overview</em>
</p>

<p align="center">
  <img src="/public/interest-assessment-results.png" width="75%" alt="Mentra Interest Assessment Results" />
  <br>
  <em>Interest Assessment Results and Career suggestions based on your RIASEC profile</em>
</p>

## 📁 Project Structure

```sh
└── mentra-frontend/
    ├── README.md
    ├── app
    │   ├── [lang]
    │   ├── auth
    ├── components
    │   ├── magicui
    │   ├── onceui
    │   ├── reactbits
    │   ├── transitions
    │   └── ui
    ├── constants
    ├── contexts
    ├── hooks
    ├── lib
    ├── middleware.ts
    ├── public
    ├── resources
    ├── services
    ├── styles
    ├── types
    └── utils
        ├── auth
        ├── i18n
        └── supabase
```

## 🚀 Getting Started

### ☑️ Prerequisites

Before getting started with mentra-frontend, ensure your runtime environment meets the following requirements:

- **Programming Language:** TypeScript
- **Package Manager:** pnpm


### ⚙️ Installation

Install mentra-frontend using one of the following methods:

**Build from source:**

1. Clone the mentra-frontend repository:
```sh
❯ git clone https://github.com/jonathan-ngamboe/mentra-frontend
```

2. Navigate to the project directory:
```sh
❯ cd mentra-frontend
```

3. Install the project dependencies:


**Using `pnpm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/pnpm-CB3837.svg?style={badge_style}&logo=pnpm&logoColor=white" />](https://pnpm.io/)

```sh
❯ pnpm install
```




### 🤖 Usage
Run mentra-frontend using the following command:
**Using `pnpm`** &nbsp; [<img align="center" src="https://img.shields.io/badge/pnpm-CB3837.svg?style={badge_style}&logo=pnpm&logoColor=white" />](https://www.npmjs.com/)

```sh
❯ pnpm dev
```

## 🔰 Contributing

- **💬 [Join the Discussions](https://github.com/jonathan-ngamboe/mentra-frontend/discussions)**: Share your insights, provide feedback, or ask questions.
- **🐛 [Report Issues](https://github.com/jonathan-ngamboe/mentra-frontend/issues)**: Submit bugs found or log feature requests for the `mentra-frontend` project.
- **💡 [Submit Pull Requests](https://github.com/jonathan-ngamboe/mentra-frontend/blob/main/CONTRIBUTING.md)**: Review open PRs, and submit your own PRs.

<details closed>
<summary>Contributing Guidelines</summary>

1. **Fork the Repository**: Start by forking the project repository to your github account.
2. **Clone Locally**: Clone the forked repository to your local machine using a git client.
   ```sh
   git clone https://github.com/jonathan-ngamboe/mentra-frontend
   ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b new-feature-x
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear message describing your updates.
   ```sh
   git commit -m 'Implemented new feature x.'
   ```
6. **Push to github**: Push the changes to your forked repository.
   ```sh
   git push origin new-feature-x
   ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.
8. **Review**: Once your PR is reviewed and approved, it will be merged into the main branch. Congratulations on your contribution!
</details>

<details closed>
<summary>Contributor Graph</summary>
<br>
<p align="left">
   <a href="https://github.com{/jonathan-ngamboe/mentra-frontend/}graphs/contributors">
      <img src="https://contrib.rocks/image?repo=jonathan-ngamboe/mentra-frontend">
   </a>
</p>
</details>