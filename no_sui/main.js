import { SuiKit } from '@scallop-io/sui-kit';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import fs from 'fs';
import readline from 'readline';

async function getAllBalancesNoSui(mnemonic) {
	const keypair = Ed25519Keypair.deriveKeypair(mnemonic);
	const MY_ADDRESS = keypair.getPublicKey().toSuiAddress();
	console.log('Address: ', MY_ADDRESS);
	const suiClient = new SuiClient({ url: getFullnodeUrl('mainnet') });
	// get balance all coin
	const balances = await suiClient.getAllBalances({ owner: MY_ADDRESS });
	// delete sui
	const otherBalances = [];
	for (let i = 0; i < balances.length; i++) {
		if (balances[i].coinType != '0x2::sui::SUI') {
			otherBalances.push(balances[i]);
		}
	}
	for (let i = 0; i < otherBalances.length; i++) {
		console.log('CoinType: ', otherBalances[i].coinType);
		console.log('Total Balance: ', otherBalances[i].totalBalance/1000000000);

	}
	return otherBalances;
}

async function transferCoin(mnemonic, coinType, amount, recipientAddress) {
	const suiKit = new SuiKit({
		mnemonics: mnemonic,
		networkType: 'mainnet',
	});

	let oceanAmount = amount;
	if (oceanAmount > 0) {
		await suiKit.transferCoin(recipientAddress, oceanAmount, coinType);
	}
	console.log(`Transfer ${coinType} to ${recipientAddress} with amount ${oceanAmount/1000000000}`);
}

async function bot(mnemonic, recipientAddress) {
	console.log('---------------------------------------------------------------------------------------------------------');
	const balances = await getAllBalancesNoSui(mnemonic);
	for (let i = 0; i < balances.length; i++) {
		await transferCoin(mnemonic, balances[i].coinType, balances[i].totalBalance, recipientAddress);
	}
	console.log('---------------------------------------------------------------------------------------------------------');
}	

async function main() {

	let recipientAddress = fs.readFileSync('recipient.txt', 'utf8');
	recipientAddress = recipientAddress.trim();
	console.log('Recipient Address: ', recipientAddress);
	
	// đọc mnemonic từ file wallet.txt
	let mnemonics = fs.readFileSync('wallet.txt', 'utf8');
	mnemonics = mnemonics.trim();
	mnemonics = mnemonics.split('\n');
	for (let i = 0; i < mnemonics.length; i++) {
		console.log('Mnemonic: ', mnemonics[i]);
		bot(mnemonics[i], recipientAddress);
	}

}

main();