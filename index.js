require('dotenv').config()

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const senderId = process.env.SENDER_ID;

const fs = require('fs');

const twilio = require('twilio');
const client = new twilio(accountSid, authToken);

const source = require('./recipients.json');
const destinationFile = './processed.json';
let processedNumbers = require(destinationFile);


const message = "Mwungere mutumiwe munama itariki 4/8 kuri CLM Rohero munteguro zanyuma z'igikorane ca 25-29/8 kuri ETS.Hatumiw umupasitori 1 kw'Ishengero.Itike iriho. Ni komite";

// const message = "Hello from Node";

const to = "";

async function sendSMS(message, to, from) {
    return client.messages
        .create({
            body: message,
            to,
            from
        })
        .then((message) => console.log(`SMS Sent to ${to} is sent successfully. Message ID:  ${message.sid}`))
        .catch((e) => console.error('Got an error:', e.code, e.message));
}


(async () => {
    try {
        // await sendSMS(message, to, senderId);
        source.forEach(async (item) => {
            if (processedNumbers.includes(item)) {
                console.log(`${item} has already been processed`);
            } else {
                console.log(`Processing SMS for ${item}`);
                await sendSMS(message, item, senderId);
                processedNumbers.push(item);
            }
        });
    } catch (e) {
        console.error('Got an error:', e.code, e.message)
    } finally {
        await sleep(10000);
        function sleep(ms) {
            return new Promise((resolve) => {
                setTimeout(resolve, ms);
            });
        }
        fs.writeFileSync(destinationFile, JSON.stringify(processedNumbers));
    }
})();
