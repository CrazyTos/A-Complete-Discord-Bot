const languageSchema = require('./schemas/language-schema.js');


// Find/Create language
module.exports.fetchLanguage = async function(guildID, lang = 'en-us') {
	let LanguageData = await languageSchema.findOne({ _id: guildID });
	if (!LanguageData) {
		LanguageData = new languageSchema({
			_id: guildID,
			language: lang.toLowerCase(),
		});
		await LanguageData.save().catch(err => console.log(err));
	}
	return LanguageData;
};

module.exports.updateLanguage = async function(guildID, lang) {
	const LanguageData = await languageSchema.findOneAndUpdate(
		{ _id: guildID },
		{ _id: guildID, language: lang },
		{ upsert: true },
	);
	return LanguageData;
};