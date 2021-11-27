const { connectDB } = require('../database/mongoose-connect');
const fs = require('fs');


const languagesTexts = {};
const guildsLanguages = {};


function getLanguagesList() {
	const languagesList = [];
	fs.readdirSync('./languages/').filter(file => file.endsWith('.json'))
		.forEach((languageFile) => {
			const langName = languageFile.toLowerCase().replace('.json', '');
			languagesList.push(langName);
		});
	return languagesList;
}


/**
 * Load guild language in variable "guildsLanguages"
 * @typedef {import('discord.js').Client} Client
 * @param {Client} client
 */
async function loadGuildsLanguages(client) {
	await connectDB().then(async (mongoose) => {
		try {
			for (const [, guild] of client.guilds.cache) {
				const result = await client.database.fetchLanguage(
					guild.id,
				);

				guildsLanguages[guild.id] = (result) ? result.language : 'en-us';
			}
		}
		finally {
			mongoose.connection.close();
		}
	});
	console.log('[LANG] Languages Loaded!');
}


/**
 * Load the translations (texts) for the variable "languagesTexts"
 */
function loadLanguagesTexts() {
	fs.readdirSync('./languages/').filter(file => file.endsWith('.json'))
		.forEach((languageFile) => {
			const langName = languageFile.toLowerCase().replace('.json', '');
			languagesTexts[langName] = require(`../languages/${languageFile}`);
		});
}

function updateLanguageCache(guildID, language = 'en-us') {
	guildsLanguages[guildID] = language.toLowerCase();
}


/**
 * @param {String} guildID
 * @param {String} textID
 * @param {Object} replacements
 */
function __(guildID, textID, replacements = {}) {
	const guildLang = (guildsLanguages[guildID]) ? guildsLanguages[guildID] : 'en-us';
	const language = languagesTexts[guildLang];
	const keys = textID.split('.');

	// Get Text
	let result = language[keys[0]];
	for (let i = 1; i < keys.length; i++) {
		result = result[keys[i]];
	}

	if (!Object.keys(replacements).length) {
		return result;
	}

	// Replacements
	if (!result.includes('{{') || !result.includes('}}')) {
		throw new Error(`[ERROR] Text " ${result} " does not contain variables for replacement.`);
	}
	for (const [key, value] of Object.entries(replacements)) {
		if (!result.includes(`{{${key}}}`)) {
			throw new Error(`[ERROR] The key " ${key} " is not in the text " ${result} ".`);
		}
		result = result.replace(`{{${key}}}`, value);
	}
	return result;
}


module.exports = {
	__,
	loadGuildsLanguages,
	loadLanguagesTexts,
	updateLanguageCache,
	getLanguagesList,
};