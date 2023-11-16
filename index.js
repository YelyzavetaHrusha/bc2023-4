const http = require('http'); // http server
const fs = require('fs'); // fs - file system
const xml = require('fast-xml-parser'); //

const server = http.createServer((req, res) => { // Створюємо HTTP сервер і визначаємо обробник запитів.
  if (req.method === 'GET' && req.url === '/') { // Перевіряємо, чи запит є GET-запитом і чи він адресований кореневому шляху ('/').
    fs.readFile('data.xml', 'utf-8', (err, data) => { 
        //parse
        const maxRate = findMaxRate(data);
        console.log(maxRate);
         
      const builder = new xml.XMLBuilder();
      const xmlStr = builder.build({"data" : {"max_rate" : maxRate}});
      res.writeHead(200, { 'Content-Type': 'application/xml' }); // 200 - OK
        res.end(xmlStr); 
    });
  } 
});

function findMaxRate(xmlData) { 

  const parser = new xml.XMLParser();
  const rates = parser.parse(xmlData)["exchange"]["currency"]

  let maxRate = 0; 

  for (const rate of rates) { 
    const rateValue = rate["rate"] 

    if (rateValue > maxRate) { 
      maxRate = rateValue; 
    }
  }

  return maxRate; 
}

const port = 8000; 
server.listen(port, () => { 
  console.log('Server is running on port" ${port}'); 
});