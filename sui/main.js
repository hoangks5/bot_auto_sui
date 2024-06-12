import { SuiKit } from '@scallop-io/sui-kit';
import fs from 'fs';



async function transferCoin(mnemonic, recipientAddress) {
	const suiKit = new SuiKit({
		mnemonics: mnemonic,
		networkType: 'mainnet',
	});
	const balances = await suiKit.getBalance();
	//console.log(balances);
	let oceanAmount = balances.totalBalance - 20000000;
	if (oceanAmount <= 0) {
		console.log('Insufficient balance to transfer');
		return;
	}
	let res = await suiKit.transferSui(recipientAddress, oceanAmount);
	console.log(`Transfer SUI to ${recipientAddress} with amount ${oceanAmount/1000000000}`);
}

async function bot(mnemonic, recipientAddress) {
	transferCoin(mnemonic, recipientAddress);
}	

async function main() {

	let recipientAddress = fs.readFileSync('recipient.txt', 'utf8');
	recipientAddress = recipientAddress.trim();
	// đọc mnemonic từ file wallet.txt
	let mnemonics = fs.readFileSync('wallet.txt', 'utf8');
	mnemonics = mnemonics.trim();
	mnemonics = mnemonics.split('\n');
	for (let i = 0; i < mnemonics.length; i++) {
		await bot(mnemonics[i].trim(), recipientAddress);
	}
}

main()