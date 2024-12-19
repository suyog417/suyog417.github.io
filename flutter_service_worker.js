'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"canvaskit/canvaskit.js.symbols": "48c83a2ce573d9692e8d970e288d75f7",
"canvaskit/skwasm.js.symbols": "262f4827a1317abb59d71d6c587a93e2",
"canvaskit/canvaskit.wasm": "1f237a213d7370cf95f443d896176460",
"canvaskit/skwasm.js": "694fda5704053957c2594de355805228",
"canvaskit/chromium/canvaskit.js.symbols": "a012ed99ccba193cf96bb2643003f6fc",
"canvaskit/chromium/canvaskit.wasm": "b1ac05b29c127d86df4bcfbf50dd902a",
"canvaskit/chromium/canvaskit.js": "671c6b4f8fcc199dcc551c7bb125f239",
"canvaskit/skwasm.worker.js": "89990e8c92bcb123999aa81f7e203b1c",
"canvaskit/skwasm.wasm": "9f0c0c02b82a910d12ce0543ec130e60",
"canvaskit/canvaskit.js": "66177750aff65a66cb07bb44b8c6422b",
"main.dart.js": "fe8ff95d7359706ee5777ea1cbc66a17",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "78e4cc609072333fbcdae6490d841451",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "a2eb084b706ab40c90610942d98886ec",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "3ca5dc7621921b901d513cc1ce23788c",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "95c3c6b6926d57cffffe3666c8c775d6",
"assets/NOTICES": "828e9293d5d1bc733b75a13b38b2282c",
"assets/AssetManifest.bin.json": "eda5926e57eec493c67d18d89c276de3",
"assets/assets/images/IMG_20241219_132606_043.jpg": "785988e49a6d7f963df4ce50c82e6079",
"assets/AssetManifest.json": "086c3621faa70f357c0a86153cb58d84",
"assets/AssetManifest.bin": "93267dacc87c20518d89223be64029d4",
"assets/fonts/MaterialIcons-Regular.otf": "b7255c0a7beef62257a22e0bec2bfe7d",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/FontManifest.json": "5a32d4310a6f5d9a6b651e75ba0d7372",
"manifest.json": "d40c47d1c161f94dbcb13094d37f1f55",
"flutter_bootstrap.js": "366ca2cd983a2f7cb702242185cbcd5e",
"flutter.js": "f393d3c16b631f36852323de8e583132",
"version.json": "009c9e65172e010890f7f65fde438006",
".git/HEAD": "cf7dd3ce51958c5f13fece957cc417fb",
".git/description": "a0a7c3fff21f2aea3cfa1d0316dd816c",
".git/COMMIT_EDITMSG": "b3c1958e70e0bac0200198b5f56b81cf",
".git/hooks/commit-msg.sample": "579a3c1e12a1e74a98169175fb913012",
".git/hooks/fsmonitor-watchman.sample": "a0b2633a2c8e97501610bd3f73da66fc",
".git/hooks/push-to-checkout.sample": "c7ab00c7784efeadad3ae9b228d4b4db",
".git/hooks/pre-push.sample": "2c642152299a94e05ea26eae11993b13",
".git/hooks/update.sample": "647ae13c682f7827c22f5fc08a03674e",
".git/hooks/pre-commit.sample": "305eadbbcd6f6d2567e033ad12aabbc4",
".git/hooks/applypatch-msg.sample": "ce562e08d8098926a3862fc6e7905199",
".git/hooks/post-update.sample": "2b7ea5cee3c49ff53d41e00785eb974c",
".git/hooks/pre-receive.sample": "2ad18ec82c20af7b5926ed9cea6aeedd",
".git/hooks/pre-applypatch.sample": "054f9ffb8bfe04a599751cc757226dda",
".git/hooks/pre-merge-commit.sample": "39cb268e2a85d436b9eb6f47614c3cbc",
".git/hooks/sendemail-validate.sample": "4d67df3a8d5c98cb8565c07e42be0b04",
".git/hooks/prepare-commit-msg.sample": "2b5c047bdb474555e1787db32b2d2fc5",
".git/hooks/pre-rebase.sample": "56e45f2bcbc8226d2b4200f7c46371bf",
".git/refs/remotes/origin/main": "79727f15880e9b13514fd40cba01c492",
".git/refs/heads/main": "79727f15880e9b13514fd40cba01c492",
".git/FETCH_HEAD": "bef08399c31e87d10dc8e6c2ee29d74f",
".git/info/exclude": "036208b4a1ab4a235d75c181e685e5a3",
".git/logs/HEAD": "a0bafc51b27ffc6e16b7e77af99f7ed1",
".git/logs/refs/remotes/origin/main": "7c5cb6a6a3059bbca1ade6670a784256",
".git/logs/refs/heads/main": "6c281188c5806f381f786f7e49449ba5",
".git/index": "63c9ed1e957cc1affb05d52e9606d235",
".git/config": "2b8f163b56e95d77ea891c5c32aa83c0",
".git/ORIG_HEAD": "b8a932601a145518235c5ebc3b96b73f",
".git/objects/84/0516208d35dcb4298847ab835e2ef84ada92fa": "36a4a870d8d9c1c623d8e1be329049da",
".git/objects/98/57c9b3b0448c92818efc5fda0f206b21914168": "ecbde07c564dabbec0f249821051b8af",
".git/objects/9a/906cdf5d0b2093a76ea06c129a5294ae8ec684": "20df594b3d54740d90e6461f83dbd73e",
".git/objects/45/1fb705292c92acf6c7b044112d8d024ca09ee5": "eeb4f6426ea5327f00728b56ed456357",
".git/objects/b1/5ad935a6a00c2433c7fadad53602c1d0324365": "8f96f41fe1f2721c9e97d75caa004410",
".git/objects/c4/b3132c2fcc89f7abaa69263a1371c10298ca1f": "d94a5322803f035bbf92c5e8b6f40db1",
".git/objects/3d/6981bf28c1f2e56454c904527123d93331c6f9": "6b89238b1e1a03ed568047f5212f06f8",
".git/objects/90/bcfcf0a77ab618a826db0fd8b0942963b653af": "fc109675cdf1233dd6599a4c3c0a7a69",
".git/objects/90/268395c1f5f1f3e7548f44c82064b4190ae274": "b8289ea9bf7fc6a6cef24b81f443c2fd",
".git/objects/44/a8b8e41b111fcf913a963e318b98e7f6976886": "5014fdb68f6b941b7c134a717a3a2bc6",
".git/objects/08/89d2a52b3c59ab7a337926d9c95319a73050a1": "f705f4bed5cf7f835b0c361bb9a2fac4",
".git/objects/08/32d0db2def1613c1c45aa4fe9156a1c6b7d589": "e05df183e5eeaddf39672a2516f9c41d",
".git/objects/7b/b0a65ee66c7d7c1c0865b24da91fc0a72c6fba": "521db8bdf3fc86ae9b05f872e00ad22d",
".git/objects/64/0d815095325fa8f6d62c8c687b78acec610502": "93c85baeba22ce76fdf2715cfe13eb0f",
".git/objects/a3/8a51efcb7e71e04fe4043b14836c0aec55302a": "738a6bff3f9dfaaf21de071c0173e185",
".git/objects/dc/7f0c5eecf8933af6374d4558ec6099ce4aa8fd": "ba04d3be7f2c8e28a3dbde0887d64bbc",
".git/objects/c7/6ab499ebfd57d36b829cb320963833b120bcf5": "ad3fe9d317c3d9814f41d706a68744e6",
".git/objects/b7/49bfef07473333cf1dd31e9eed89862a5d52aa": "36b4020dca303986cad10924774fb5dc",
".git/objects/32/aa3cae58a7432051fc105cc91fca4d95d1d011": "4f8558ca16d04c4f28116d3292ae263d",
".git/objects/e7/24a4dc8a3044e61a9020ee0047d027a3f81fa5": "ae53622e6562602659da9599d0834d5e",
".git/objects/pack/pack-54445e4c5ae37c4f16601dcc753955bdb14fb557.rev": "91f0ade619d32d428d0a681c055b36ff",
".git/objects/pack/pack-54445e4c5ae37c4f16601dcc753955bdb14fb557.idx": "28498a76fb01dbe24be2d08d8c3dd474",
".git/objects/pack/pack-54445e4c5ae37c4f16601dcc753955bdb14fb557.pack": "675738a105c6a060fe5b4d4bf24e5693",
".git/objects/d5/bb50b3c3bc534b51ba035a5e8495ba7af5025b": "81d30e6f235d2cd1960b1a0d917b3043",
".git/objects/fe/3914bcf3baf9d87a873a444cac8aaf9dcd54c1": "372add7dd6cdabc32b9333e8d66bff72",
".git/objects/5e/bf37944a56f2b5e479e3858392c6e9030da2da": "d874f5ce1eb6512c7b77ebd17b676f00",
".git/objects/d1/201e4e259818b5e1640e1e79291b7615c806b7": "99b1ea7948bebf7f3ab110b4878eff04",
".git/objects/23/637bc3573701e2ad80a6f8be31b82926b4715f": "5f84f5c437bb2791fdc8411523eae8ff",
".git/objects/59/62efb2dffef4c259bda261b128fcab4b659c34": "11e1a7683fedc73b6a0da57ee3c6a112",
".git/objects/0a/a15e85552db781a461f63303a74f37c7d5f0a9": "497acff488e63aa7f6672bdd408dd2d1",
".git/objects/a2/b5830d763cedce6e686f6e26309ce542ff74ae": "4df577dcfd62ceb9741b5a8ea58d5209",
".git/objects/9d/316ffc40f6e837be13c73e87fd08d7637c5659": "04b4a84580028daf7ea61e0e37c1e6bc",
".git/objects/9d/8c3c1e758ef8711186ae12fb0fd22aaa0f70db": "a391c0384d1cabd19155f2907d961b09",
".git/objects/f2/04823a42f2d890f945f70d88b8e2d921c6ae26": "6b47f314ffc35cf6a1ced3208ecc857d",
".git/objects/4e/d3408096d15ea9a2e03666205f7d8037a0236f": "be2c5ca2ece9b2826de40e61980b044b",
".git/objects/4f/2f3cd28bc1db11c3dfefbc9326bd5d87daf8d7": "c617cb02f8e4ce6f658a348390bee47e",
".git/objects/29/261bd5373b170f54ddbb4ceb276de67e6a9a1c": "d8545573487fa61ea2e6080a8a8d375e",
".git/objects/1e/423a247f6ee611d723e95f686fd97455cd2f87": "3d5f93580ea15ca0cdb6e3f8b37f902c",
".git/objects/d6/9c56691fbdb0b7efa65097c7cc1edac12a6d3e": "868ce37a3a78b0606713733248a2f579",
".git/objects/88/cfd48dff1169879ba46840804b412fe02fefd6": "e42aaae6a4cbfbc9f6326f1fa9e3380c",
".git/objects/88/fa409d80a1c5ec49d16496cd4b08a2fd0a12bb": "dcae3a23f211e42c1d2c7451abb65cff",
".git/objects/b9/2a0d854da9a8f73216c4a0ef07a0f0a44e4373": "f62d1eb7f51165e2a6d2ef1921f976f3",
".git/objects/40/0d5b186c9951e294699e64671b9dde52c6f6a0": "f6bd3c7f9b239e8898bace6f9a7446b9",
".git/objects/40/729ef3e52bb70644c2784f0f284e891115dc1d": "8d23ccb0d3bfe9653842e4f3facf1760",
".git/objects/42/07dfed9112a21313711c1fc5ef00400ebde40d": "ea9184f0fde306a409217dc2076c3b24",
".git/objects/1d/e2e65fd73fead648f23e27df2cea2230e4f121": "b3bf81b4c5b2de35683eeb3afed5ec47",
".git/objects/8a/aa46ac1ae21512746f852a42ba87e4165dfdd1": "1d8820d345e38b30de033aa4b5a23e7b",
".git/objects/46/f9a0eb3019bec0d4cd31723138b62010c7a3ff": "5e457518a7073442984937aec645cbbc",
".git/objects/6e/964696041dc673b0c66b02d75b03d2bfada055": "aea676d55f96933b7435136769a6d19b",
".git/objects/6b/e909fbf40b23748412f0ea89bf0fae827ed976": "5f118419157d9534688915220cc803f7",
".git/objects/d0/23371979cf1e985205df19078051c10de0a82d": "700b71074bad7afee32068791dec7442",
".git/objects/58/5f9ffde204a7613dc9e3a47b6c7cd365c0ea44": "5a166fe7236712ef52e2b3b20f9b3a6f",
".git/objects/d4/3532a2348cc9c26053ddb5802f0e5d4b8abc05": "3dad9b209346b1723bb2cc68e7e42a44",
".git/objects/ce/e3c5bb4ad9ca1b7e02e3391cc1cbba998308b7": "8e23cc0d8eea61c17a30b19ec3ccb417",
".git/objects/5f/f5e1fc4e3110d0af9fafd12c88d90571769552": "74c19d9fcbdfb45f34937319a2e53549",
".git/objects/3a/b17bdbbe276f50f18e6568d828b8fc9fc46274": "f5581aea62fb7c3bd8bbea9400ef378a",
".git/objects/3a/7525f2996a1138fe67d2a0904bf5d214bfd22c": "ab6f2f6356cba61e57d5c10c2e18739d",
".git/objects/f6/ce9dbcecd715bd183706c56c7969ada60cb201": "091347178c0a9f469bf2f3dfc41d1921",
".git/objects/c9/1830fb00cd8daff99b1080ed46c6a410653c3c": "546015247ce69a996af8ce5d8983baba",
".git/objects/a0/0a7338c208185d661031e1f3438763c0248c25": "1a354476fa154a5138615894c79573a9",
".git/objects/1a/df25f0405d25ab365b54a97e9df42bd99bb3ad": "cc038b6e62a7436e066e72a339857180",
".git/objects/1a/b58cd7131a32290d86a0f2a4d23f7ba47eb664": "52e2e2327a0a1037b9b37befcef6e1fb",
".git/objects/da/fd65422747502c19b5c74b4230282644d2169c": "d8a62caf99a372ff6c7692e143787ce3",
".git/objects/4b/4420cbfbb527ebe20c44dbf725a95ed2e85e28": "48a81f08a0e7de2090d08a735a122b94",
".git/objects/eb/9b4d76e525556d5d89141648c724331630325d": "37c0954235cbe27c4d93e74fe9a578ef",
"index.html": "c1c5f29031926111ab3ccb7c551c88f9",
"/": "c1c5f29031926111ab3ccb7c551c88f9"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
