const axios = require('axios')
const fs = require('fs')
var prompt = require('prompt-sync')();
const HttpsProxyAgent = require('https-proxy-agent');
const sleep = require('await-sleep')
const colors = require('colors')

//---------------------------------------------------------------------------------------------------------------------------------------------------
const logo = `
╔═╗╔═╗╔╦╗  ╔═╗╦═╗╔═╗═╗ ╦╦ ╦
║ ╦║╣  ║   ╠═╝╠╦╝║ ║╔╩╦╝╚╦╝
╚═╝╚═╝ ╩   ╩  ╩╚═╚═╝╩ ╚═ ╩ 
1. HTTP PROXY 
2. SOCKS4 PROXY
3. SOCKS5 PROXY
`

function main() {
  console.clear()
  console.log(logo.brightYellow)
  var input = prompt('Input [ 1,2,3 ]: ');
  var timeout = prompt('Ping [ 1000-10000 ] : ');


  switch(input) {
    case '1':
    http(timeout)
    break;
    case '2':
    socks4(timeout)
    break;
    case '3':
    socks5(timeout)
    break;
    default:
    main()

  }
}

//---------------------------------------------------------------------------------------------------------------------------------------------------
async function http(timeout) {

  const proxygets = await axios.get('https://api.proxyscrape.com/?request=getproxies&proxytype=http&timeout=' + timeout + '&country=all&ssl=all&anonymity=all')
  var proxygetspass = proxygets.data
  console.log('GET PROXY OK')
  await sleep(1000)
  checker_proxy(proxygetspass)
}


async function socks4(timeout) {

  const proxygets = await axios.get('https://api.proxyscrape.com/?request=getproxies&proxytype=socks4&timeout=' + timeout + '&country=all&ssl=all&anonymity=all')
  var proxygetspass = proxygets.data
  console.log('GET PROXY OK')
  await sleep(1000)
  checker_proxy(proxygetspass)
}

async function socks5(timeout) {

  const proxygets = await axios.get('https://api.proxyscrape.com/?request=getproxies&proxytype=socks5&timeout=' + timeout + '&country=all&ssl=all&anonymity=all')
  var proxygetspass = proxygets.data
  console.log('GET PROXY OK')
  await sleep(1000)
  checker_proxy(proxygetspass)
}

//---------------------------------------------------------------------------------------------------------------------------------------------------
function checker_proxy(proxy_unchecks) {

  var proxy_uncheck = proxy_unchecks.toString();
  var proxies = proxy_uncheck.split('\r\n');
  console.log(proxies.length)
  for(var i = 0; i < proxies.length; i++)
  {
    send(proxies[i]);
  }
  
}

//---------------------------------------------------------------------------------------------------------------------------------------------------
var ii = 1
function send(proxies) {
  var agent = new HttpsProxyAgent('http://' + proxies);

  var config = {
    method: 'get',
    timeout: 5000,
    httpsAgent: agent,
    url: 'https://api.ipify.org?format=json',
    headers: { 
      'Cache-Control': 'no-cache',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
    }
  };
  axios(config).then(function (response) {

    var ip_check = response.data.ip
    var proxy_split = proxies.split(":")[0];

    if (ip_check == proxy_split) {
      fs.open('proxy.txt', 'a', 666, function( e, id ) {
        fs.write( id, proxies + "\n", null, 'utf8', function(){
          fs.close(id, function(){
            console.log(ii,proxies);
            ii++
          });
        });
      });
    }

  }).catch(function (error) {

  });
}

//---------------------------------------------------------------------------------------------------------------------------------------------------
main()