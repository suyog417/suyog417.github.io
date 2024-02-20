'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {".git/AUTO_MERGE": "1bdcba4df8d6b5e41dee1a4803535847",
".git/COMMIT_EDITMSG": "c9a48c4e8b7b85b533ea2b671d05e5d8",
".git/config": "b046f739be581b71ecde40f0f6e20c89",
".git/description": "a0a7c3fff21f2aea3cfa1d0316dd816c",
".git/FETCH_HEAD": "55b0407b69a6880900784e84551a338e",
".git/HEAD": "cf7dd3ce51958c5f13fece957cc417fb",
".git/hooks/applypatch-msg.sample": "ce562e08d8098926a3862fc6e7905199",
".git/hooks/commit-msg.sample": "579a3c1e12a1e74a98169175fb913012",
".git/hooks/fsmonitor-watchman.sample": "a0b2633a2c8e97501610bd3f73da66fc",
".git/hooks/post-update.sample": "2b7ea5cee3c49ff53d41e00785eb974c",
".git/hooks/pre-applypatch.sample": "054f9ffb8bfe04a599751cc757226dda",
".git/hooks/pre-commit.sample": "305eadbbcd6f6d2567e033ad12aabbc4",
".git/hooks/pre-merge-commit.sample": "39cb268e2a85d436b9eb6f47614c3cbc",
".git/hooks/pre-push.sample": "2c642152299a94e05ea26eae11993b13",
".git/hooks/pre-rebase.sample": "56e45f2bcbc8226d2b4200f7c46371bf",
".git/hooks/pre-receive.sample": "2ad18ec82c20af7b5926ed9cea6aeedd",
".git/hooks/prepare-commit-msg.sample": "2b5c047bdb474555e1787db32b2d2fc5",
".git/hooks/push-to-checkout.sample": "c7ab00c7784efeadad3ae9b228d4b4db",
".git/hooks/sendemail-validate.sample": "4d67df3a8d5c98cb8565c07e42be0b04",
".git/hooks/update.sample": "647ae13c682f7827c22f5fc08a03674e",
".git/index": "29b1b51810a474b3e96d9a143544b51c",
".git/info/exclude": "036208b4a1ab4a235d75c181e685e5a3",
".git/logs/HEAD": "d19f87c3b8e8de67425e2c9c226bc64a",
".git/logs/refs/heads/main": "5e5cd1356732406b55382c7ed1bc66aa",
".git/logs/refs/remotes/origin/main": "70076389f7a02bdef48ff1d6066d53fb",
".git/MERGE_MODE": "d41d8cd98f00b204e9800998ecf8427e",
".git/objects/00/fa0bdbc80b9d3a0a17299c23cbff1a7c594594": "59f7163ed4ab9a137e1bc4a75d585c01",
".git/objects/02/842d69ee38d5b7e4ba6ed21c124ea4dafe04e7": "dbf4a59cd13dddffb50f62aecdfd70e9",
".git/objects/02/bb649b1bc1346bb423cb3aa144af0907780c1d": "06a05d9ba243c48576fced5eb99bdf89",
".git/objects/02/dec563ebe6d06524c0e604c4aa97950e0eba1e": "868293a29b853048ebe6cdbb36788e94",
".git/objects/03/eaddffb9c0e55fb7b5f9b378d9134d8d75dd37": "87850ce0a3dd72f458581004b58ac0d6",
".git/objects/04/6ce4d07d666e8aaf458afe1b6bfaff8d1130d6": "b92f9d4c82e995f46f9239e216ed4469",
".git/objects/04/e5efc15dc0c60ea2ffcc37c5bf25e96689f44d": "978222f47488835b92838c74cb5c684c",
".git/objects/07/aa26695687f7b7d0d385349f81bbf9ace2950e": "e901d727fcbaf2197a01f8eb72d64208",
".git/objects/0d/0df08f7c3e147a8ae36017cf81a96e35b73717": "106e868f28a72727fb6fb0fa71123633",
".git/objects/0d/846c8d4e47a645a373889c8b2c499152924140": "7f8f3bbf2e35701a64b33210abfe6443",
".git/objects/0e/1ee121f7a683ea1226d5e66f9809b9447202b8": "113d741b0a8f31585a59038dd4438e29",
".git/objects/0e/e3590f4d74c3a4e4621a8d048d01f13436ec7a": "25939fd9f3cb53628d90cf3f4f9a026a",
".git/objects/13/4c90f49e509ba8cae09aef70b7bd55a09d02fc": "173804241ea0cd67460ba6ae8ed8b572",
".git/objects/1c/3bdaa886dfae314d7a4af9f491d31017e5890c": "47c2bf478830f64da798202286379d22",
".git/objects/1d/9cb9622805dc9f5fa474e6a9d46eda315d2aaf": "bf1c3e4d85830b091818e6965e9a536f",
".git/objects/1f/9dea86d49da71f095111707d03b9140eb69733": "0bd4fa0f40267bf0e6d88529e788d60b",
".git/objects/20/1afe538261bd7f9a38bed0524669398070d046": "82a4d6c731c1d8cdc48bce3ab3c11172",
".git/objects/20/aeca2baab58855a433bab48af3fbd944993b3a": "fcc22cb0a296f8ac44319b6497cdb303",
".git/objects/22/774af18f835e8d82f4487488de72a1ae3aeb9e": "bf2544dbdc462ef345ab469fb5b2403e",
".git/objects/23/637bc3573701e2ad80a6f8be31b82926b4715f": "5f84f5c437bb2791fdc8411523eae8ff",
".git/objects/24/b1f14dd348b07c9b8373758bde9ac14d16fd92": "dbf45d6c044044561758a334420e9569",
".git/objects/25/ff4bb8e13dbca18873abc8dc12d5e5c3edebe8": "585c9c42a0267a30e5f89427e9bf4e73",
".git/objects/27/9a74f264565865533ef826b4c62eb5fe3faef4": "3c6b3621de979bee8043b40867d84a43",
".git/objects/28/6b583725be3c2525b7c06d5f9f7f6b7024b8d9": "b625c75915e4f69f5f2c069215249b5b",
".git/objects/29/fa4512f21b61564761df5585a11be1cc985476": "decc5e942c917e8ed7ad81ac82d3f283",
".git/objects/2b/e39c7fd3da441ddac9bea54fd12621dd39960a": "24031b20667d22ca8dba4debe8b9eab5",
".git/objects/2d/cf3542c874e33cd8ab86ceb6f0ec444228aa78": "66baad0ae5d874f09b6eee790095bc65",
".git/objects/2f/72c880b9f00580cbccd6d34b7eefb160ba2722": "addf07d4a27307dbf8a06ce3af8744cc",
".git/objects/2f/a9982ce0b5847eb1e1113cc13564849fe26935": "7dc1177f6ab918e1cbc3e32bcb958921",
".git/objects/35/32d4989bec911d2dd3684bf0566cadafef231d": "c86101b930a225d6a8f4017ca4abccbb",
".git/objects/35/999518f50dd214053842ded9bae4726ec576a9": "567d7f2ccbd8edd352f0b5cfa13d61cf",
".git/objects/37/9cc041b2a78205f9dee300127c7514b40c013e": "7b99b15bb973c0337175f07949a86ce0",
".git/objects/3a/7795ce82e55d8f9c99e7beaa0c85141f8d2835": "8a5558c663d87709cb2353c1b35642f0",
".git/objects/3d/46966e4a1b8ed934c1e0989807ac5a456160c9": "7b84fe22ed46727490d868e26a3a6ad1",
".git/objects/43/e946e398d96aee466fa0aabb625f0889c3a4bd": "ac34520dee747f675e6e0a15c0bbd2be",
".git/objects/45/544ba125341b0fcf36c7d67533021737d54cb0": "faba682ae1a812c0a8df83f73ab97985",
".git/objects/46/4ab5882a2234c39b1a4dbad5feba0954478155": "2e52a767dc04391de7b4d0beb32e7fc4",
".git/objects/46/e7905ce247f4bc521be504cb21303c8248adb6": "a0973c4f102fb2abfc84e77c32a68a75",
".git/objects/47/2d45a19783244eaff67a7ac2766abc5fa31485": "939a307089fb55db9a6ec9cd64388758",
".git/objects/48/33fcf9ba677d3df448c90e63368e50f8bfc8d6": "a5b926fccf641f8e2a09e52478c0d37a",
".git/objects/4b/825dc642cb6eb9a060e54bf8d69288fbee4904": "75589287973d2772c2fc69d664e10822",
".git/objects/4d/641911c3d82272220461df3f909c2c8ec83791": "e4f334eb7e35ac82804bbaa7f3ba45c3",
".git/objects/4e/89617a3696bd10c155ec378f4a65a9f89e9e3a": "d8056e20bae90d092b619c895129e982",
".git/objects/4f/d0e51f345ee398d4c56c9a2a36514cfdc54f3e": "d8e976b7b97437231f01681fc40815a3",
".git/objects/52/480a63b1f184ea74afb06662aa98fa98864864": "6f8b2cf71be2b4830601f9db57eded45",
".git/objects/53/7807567919e88db2866b7825339c57e94c24d8": "970aec5149a3dbe9370a9dc982cdd022",
".git/objects/55/4f530e020d2cc0c980531cea9e3c0a5beceb8e": "660d6762d7834ae085fc2a0653a1c1b6",
".git/objects/5e/32ad4b114fd3f009a106e0994cdf686f16e5de": "3e38e510af67b0c37a95941159def2f2",
".git/objects/69/dd618354fa4dade8a26e0fd18f5e87dd079236": "8cc17911af57a5f6dc0b9ee255bb1a93",
".git/objects/6e/5f83ae4363a08260e41e79888ad48cba9b3829": "8953b1a6040cd3c9e396273115b09a16",
".git/objects/76/8651b2e249c2517c7b37bdbeea0a5d8bfbb707": "495b1c4fefa633f6afe4dc5840ebe18f",
".git/objects/79/ba7ea0836b93b3f178067bcd0a0945dbc26b3f": "f3e31aec622d6cf63f619aa3a6023103",
".git/objects/85/05ea82a73c11de0b64925e5192863341e33668": "360122eb7394d3dff7e70898ece4a3b3",
".git/objects/86/d4eade76e7d5c05e596e538273f4edd4442421": "cbc1b6c79d8f65450d9905a2b8b7a7a5",
".git/objects/88/a5796c795b9c62be2e1eac970c0a2d64de3c70": "03ae40777fa5a91486fcd87bee9f75be",
".git/objects/88/cfd48dff1169879ba46840804b412fe02fefd6": "e42aaae6a4cbfbc9f6326f1fa9e3380c",
".git/objects/88/f40a77c1a86bc64ca7edfb8171a1899d1c0d80": "b42f43eaeeb067abe35523cc4205844c",
".git/objects/8a/aa46ac1ae21512746f852a42ba87e4165dfdd1": "1d8820d345e38b30de033aa4b5a23e7b",
".git/objects/8a/fafde6a649662e31637d54d02d0834a615e7dc": "7bf0843ee42b9cc5d9c6f63909892fec",
".git/objects/8f/e7af5a3e840b75b70e59c3ffda1b58e84a5a1c": "e3695ae5742d7e56a9c696f82745288d",
".git/objects/93/fcd00e513e6ab6d7d976b378901d06e44e0c1c": "1d449fd858e6e424391a8763d47d3d62",
".git/objects/94/b52e13bf7919ae4ea7235d78019b592dde8611": "b79fa5ca1cdbf72f253763797850f314",
".git/objects/94/fd5b3419ccff7062559184655f3f62c03751b9": "1a32794b7c9141c415d1a22addbc063d",
".git/objects/a1/3837a12450aceaa5c8e807c32e781831d67a8f": "bfe4910ea01eb3d69e9520c3b42a0adf",
".git/objects/a9/33781b6559a149f4edb57b87d66953b874bd37": "a847a0ae92c6dbfefb5cf44a730bc2f0",
".git/objects/ad/ad5582172421c3500d2b4e92b508b2903d4a0d": "a845ae072a4a8541f8e7c6b304d9f12a",
".git/objects/b7/49bfef07473333cf1dd31e9eed89862a5d52aa": "36b4020dca303986cad10924774fb5dc",
".git/objects/b9/2a0d854da9a8f73216c4a0ef07a0f0a44e4373": "f62d1eb7f51165e2a6d2ef1921f976f3",
".git/objects/ba/2a89868a248951fb82804b87b6f43628936bb3": "77edba1931bd51eded60560c002947e0",
".git/objects/ba/651eb2389ba1b68385f9e7d0a7cebf60076cc3": "2368df88b78f3b3c669b8a0e822d5647",
".git/objects/ba/8cb00dd5231f1a55de0205c16445926a696526": "be8592f9341c9b01b70890c8614c6cf7",
".git/objects/bb/3085876799532613a08c7ebe43f24f0cc46864": "1b6aa21800d948d5513c15e54d131215",
".git/objects/bc/6f432e23954fb06e58ee545633b8a7dfe00928": "7d6c69e5250d2d47b3e3284649461b65",
".git/objects/bd/89cde3ab8038fe9611f387eb9a1cf4bab3d11b": "1148aaff82397d024e3f6e25311b5d0d",
".git/objects/c3/a3d3d3283e2313751080267db96ab2f65e7d0a": "473c5069b097732ecb8993aa4ae46815",
".git/objects/cc/dcb738fa0302cff52e813554437026d3c1d83e": "13044967f98564fd716a5b2a7289c6ae",
".git/objects/d0/03a53106e1ade6309cf2760ecc84a8366cd26b": "474300794b39665fadd6d307c29e5463",
".git/objects/d1/5ac224dfb999673bf3fdf1c02959088a0cf841": "1db12f1ce5c9c38a1d356e9fa5226cad",
".git/objects/d6/9c56691fbdb0b7efa65097c7cc1edac12a6d3e": "868ce37a3a78b0606713733248a2f579",
".git/objects/d7/2c11112c7cb4e2ce754bc41470f9b829a2d00a": "d7280a766a5d6033f187d874a92b5ad6",
".git/objects/dc/6bee7bd882a198114471938fdbc9ea23edcf2f": "c764d236e95108b3aeb37e511bda8c76",
".git/objects/df/7d2dcb89ab89da87467c0e1059b38c8d8f9296": "a44162ff357b024e4638ab18a9bb01c7",
".git/objects/e5/951dfb943474a56e611d9923405cd06c2dd28d": "c6fa51103d8db5478e1a43a661f6c68d",
".git/objects/e6/b745f90f2a4d1ee873fc396496c110db8ff0f3": "2933b2b2ca80c66b96cf80cd73d4cd16",
".git/objects/e6/f5fe6f6f64fc18b0176d1dbcda6a2cf41664e5": "3e6ecd35b55e4c1e3611539827d859a7",
".git/objects/e9/6826aa84c2720c501d6914ef868689dd721a0e": "ddca7c0a5ac8e4ae6b2ff8884cc5c43c",
".git/objects/e9/e575d0b36ebd696294496017834c26b62e1505": "8eca52e53d59927cc7c00a13888ea67b",
".git/objects/eb/9b4d76e525556d5d89141648c724331630325d": "37c0954235cbe27c4d93e74fe9a578ef",
".git/objects/eb/bc20ffce3044df22bd26840599b80186b545d8": "0b83cbf7edd23bcb2d6f3b5f133ab275",
".git/objects/ed/5b9f0e6124298bbe8bcd51fe46f80a65fdb7c9": "84133ae68dbe3a534d155890f6eafc75",
".git/objects/f3/6ce8ecc9cd73543cfa3529b1c0e1c778186f73": "2eaf9757c281ad687fe4540481ecb2a1",
".git/objects/f3/c76268875a36d521ed4c9960808f26bddabae0": "773043beca25abdcf1f75ded890bcea3",
".git/objects/f4/d439881a756c5eb60fbc8a791d608460fe5851": "1ee12106db999802b003a3d636cdafef",
".git/objects/f5/56d6032eba7283dd1dfcbeb2dc0047ba2a2062": "a648df79445aa02c74ceb8bba141ea92",
".git/objects/f7/a7add1befa00d45975c307f0d84f9759bd4ff9": "10ea707d355a730efd5e62d894210b90",
".git/objects/fe/60df34669b6a67880bea84df17e192c7133055": "2f3a362e8a5ce1a2d69b26dfe8e0d2ea",
".git/objects/ff/559e22d8fc2a798ce80a95727165f1344e1a3f": "5f77a77fb4e1e90d8f1f9810fe55ca00",
".git/ORIG_HEAD": "6ac96464ddf68f2e5d50f0d39e37b777",
".git/refs/heads/main": "e79ff86f722206b8bd17b6be97445a54",
".git/refs/remotes/origin/main": "aa63dc8a4595b337821d3e196e114f14",
"assets/AssetManifest.bin": "693635b5258fe5f1cda720cf224f158c",
"assets/AssetManifest.bin.json": "69a99f98c8b1fb8111c5fb961769fcd8",
"assets/AssetManifest.json": "2efbb41d7877d10aac9d091f58ccd7b9",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "35ca0be3a940079185080c6b3cf6d425",
"assets/NOTICES": "df062e2f92d973b97ba201e36da5d8ba",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
"assets/shaders/ink_sparkle.frag": "4096b5150bac93c41cbc9b45276bd90f",
"canvaskit/canvaskit.js": "eb8797020acdbdf96a12fb0405582c1b",
"canvaskit/canvaskit.wasm": "73584c1a3367e3eaf757647a8f5c5989",
"canvaskit/chromium/canvaskit.js": "0ae8bbcc58155679458a0f7a00f66873",
"canvaskit/chromium/canvaskit.wasm": "143af6ff368f9cd21c863bfa4274c406",
"canvaskit/skwasm.js": "87063acf45c5e1ab9565dcf06b0c18b8",
"canvaskit/skwasm.wasm": "2fc47c0a0c3c7af8542b601634fe9674",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "59a12ab9d00ae8f8096fffc417b6e84f",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "ebcfcafbbdc958e10c869a9b52a7e5e9",
"/": "ebcfcafbbdc958e10c869a9b52a7e5e9",
"main.dart.js": "27048aa8dcdcb29eaa66ccc56f92ceac",
"manifest.json": "aee7c4007fda52a6824c76eec5a84487",
"version.json": "cc132570d6d238130e38adc59e1f998d"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
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
