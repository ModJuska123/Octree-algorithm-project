# Octree-algorithm-project

This project is used for learning purpose only. The project implements a standard Octree algorithm using JavaScript and the Three.js library. The Octree is used for 3D spatial partitioning by recursively subdividing space into smaller cubes (nodes) and adding spheres in each. Created objects are saved to LAS format file and delivered to pc. 

![image info](./img.png)

## 📑 Table of Contents
- Installation
- Running the APP
- Use commands in VSC terminal
- Authors
- License

## 🚀Installation
To get started:

1. Open the folder to clone the APP:

```powershell
cd YourFoldersName
```

2. Clone the APP: 

```powershell
git clone https://github.com/ModJuska123/Octree-algorithm-project
```

3. Navigate to your folder:
```powershell
cd YourFoldersName
```
3. Check weather Node and NPM are installed:
```powershell
node -v
npm -v
```

4. Instal vite
```powershell
npm install --savedev vite
```

5. Instal three.js library
```powershell
npm install --save three
```
6. Adjust package.json file "scripts" part adding extra script
```powershell
"scripts": {
    "dev": "vite --host 127.0.0.1"
  }
```

## 🎉Running the APP

1. Open the APP you just cloned entering `cd YourFoldersName`.
2. Run the APP entering `npm run dev` into the terminal.
3. Generated 3D image will be shown in your browser.


## 🧪LAS file saving process 

As soon you will run the code LAS file will be generated and saved to your PC.

## 🎓 Authors

Modestas Juška: [Github](https://github.com/ModJuska123).

## 🎭 License

Distributed under the MIT license.