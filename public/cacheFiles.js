const { exec } = require("child_process");
const fs = require("fs");

console.log("Generating service worker...");
/**
 * This script runs just after the front end app is built
 * Generates the service worker
 * The service worker is responsible for caching the files
 * It is also necessary for the app to be served as a PWA
 * This script parses the public folder and returns an absolute file path for each file to be parsed
 * At the time of writing this the cache is about 20MB
 * TODO: Remove files from the public folder that are not used
 */

let dir = "";
let cacheFiles = [];

getMainDir = () => {
  /**
   * Sets the main directory and returns a list of files/folders in that directory
   */
  return new Promise((resolve, reject) => {
    exec("pwd", (err, stdout, stderr) => {
      if (err) return reject(err);
      if (stdout) {
        dir = stdout.split("\n").join("/");
        exec("ls", (err, stdout, stderr) => {
          if (err) return reject(err);
          if (stdout) {
            return resolve(stdout);
          }
          if (stderr) return reject(stderr);
        });
      }
      if (stderr) return reject(stderr);
    });
  });
};

parseDirectory = (directory) => {
  /**
   * Uses recursion to populate the cacheFiles array with absolute file paths
   * Lists contents of directory
   * Loops through contents
   * If item is a file, push absolute path to that file to the cacheFiles array
   * If item is a directory, perform the same action on that directory
   * Repeat until all files have paths
   */
  return new Promise(async (resolve, reject) => {
    try {
      if (directory.includes("LICENSE")) resolve();
      else
        exec(`cd ${dir}${directory} && ls`, async (err, stdout, stderr) => {
          if (err) return reject(err);
          if (stdout) {
            let data = stdout
              .split("\n")
              .filter(
                (file) =>
                  !file.includes("main.") && !file.includes("index.html")
              );
            for (let i = 0; i < data.length; i++) {
              let point = data[i];
              if (point !== "") {
                if (point.includes("."))
                  cacheFiles.push(`./${directory}/${point}`);
                else await parseDirectory(`${directory}/${point}`);
              }
            }
            return resolve();
          }
          if (stderr) return reject(stderr);
        });
    } catch (err) {
      console.log("parse error", err);
      resolve();
    }
  });
};

updateManifest = () =>
  new Promise((resolve, reject) => {
    fs.readFile(__dirname + "/manifest.json", "utf8", (err, data) => {
      if (err) {
        console.log("manifest read error", err);
        reject();
      } else {
        data = data
          .split(`"start_url": "start_url",`)
          .join(`"start_url": "⚓⚓domain⚓⚓",`);
        data = data
          .split(`"scope": "scope",`)
          .join(`"scope": "⚓⚓domain⚓⚓",`);
        data = data
          .split(`"short_name": "short_name",`)
          .join(`"short_name": "⚓⚓app_name⚓⚓",`);
        data = data
          .split(`"name": "name",`)
          .join(`"name": "⚓⚓app_name⚓⚓",`);
        fs.writeFileSync(__dirname + "/manifest.json", data);
        resolve();
      }
    });
  });

updateIndexHTML = () =>
  new Promise((resolve, reject) => {
    fs.readFile(__dirname + "/index.html", "utf8", (err, data) => {
      if (err) {
        console.log("index read error", err);
        reject();
      } else {
        data = data
          .split("<title></title>")
          .join(`<title>⚓⚓app_name⚓⚓</title>`);
        fs.writeFileSync(__dirname + "/index.html", data);
        resolve();
      }
    });
  });

(mainFunction = async () => {
  try {
    /**
     * Get the root directory and its contents, then parse it
     * Create a service worker that caches all of the files in that directory and subdirectory.
     * Instruct the application to serve items from the cache instead of fetching them when possible
     * Write the service worker to the local file system
     */

    try {
      //   const mainLocations = await getMainDir();
      //   const dontCache = ["bootstrap-icons", "emojis", "fontawesome", "LICENSE"];
      //   for (let i = 0; i < mainLocations.split("\n").length; i++) {
      //     let data = mainLocations.split("\n")[i];
      //     if (data !== "" && data.split(".").length < 2) {
      //       if (dontCache.indexOf(data) === -1) await parseDirectory(data);
      //     }
      //   }
      await parseDirectory("assets");
    } catch (err) {
      console.log("parseDirectory error", err);
    }

    const serviceWorker = `
        
        self.addEventListener("install", e => {
            const version = ${process.env.VERSION};
            console.log('Installing version', version);
            caches.keys().then(files => {
                console.log('Removing old...');
                files.forEach(file => caches.delete(file));
                e.waitUntil(
                    caches.open('static').then(cache => {
                        console.log('caching...');
                        return cache.addAll(${JSON.stringify(cacheFiles)})
                    })
                );
            })
            
        });
        
        self.addEventListener('fetch', e => {
            if (e && e !== undefined && e.request.method === 'GET'){
                e.respondWith(
                    caches.match(e.request).then(res => {
                        return res || fetch(e.request);
                    })
                )
            }
            
        });
    `;
    fs.writeFileSync(__dirname + "/serviceWorker.js", serviceWorker);
    console.log("Service worker generated", __dirname + "/serviceWorker.js");

    // console.log('Updating manifest...');
    // await updateManifest();
    console.log("Manifest updated");
    console.log("Updating index.html...");
    await updateIndexHTML();
    console.log("index.html updated");
  } catch (err) {
    console.log("cacheFiles error", err);
  }
})();
