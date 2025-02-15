require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const { factsWithImages, compliments } = require('./data.js');

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const START_DATE = new Date(2023, 0, 19);

const bot = new TelegramBot(TOKEN, { polling: true });

const userFactsProgress = {};

const keyboard = {
    reply_markup: {
        keyboard: [
            [{ text: '❤️ Сколько мы вместе?' }, { text: '💌 Факты о нас' }],
            [
                { text: '📸 Фотки наши' },
                { text: '👏 Комплименты красотке на каждый день' },
            ],
        ],
        resize_keyboard: true,
    },
};

const continueKeyboard = {
    reply_markup: {
        keyboard: [[{ text: 'Продолжить➡️' }]],
        resize_keyboard: true,
    },
};

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    fs.readFile(path.join(__dirname, 'images/62.jpg'), (err, data) => {
        if (err) {
            bot.sendMessage(
                chatId,
                'Ошибка при загрузке фотографии. Пожалуйста, попробуйте позже.'
            );
            return;
        }

        bot.sendPhoto(chatId, data);

        bot.sendMessage(
            chatId,
            '💌 *С Днём святого Валентина, моя любимая Эля!* 💌\n\n' +
                'Сегодня особенный день — день, когда весь мир говорит о любви. Но знаешь, что? ' +
                'Для меня каждый день — это день любви к тебе. Ты — моё солнце, моё вдохновение и моё счастье. ' +
                'Спасибо, что ты есть в моей жизни. Ты делаешь её ярче, теплее и прекраснее. ' +
                'Я бесконечно благодарен за каждую улыбку, за каждый момент, проведённый вместе. ' +
                'Ты — моя Валентинка на всю жизнь. ❤️\n\n' +
                'Я создал этого бота, чтобы напоминать тебе, как ты важна для меня. ' +
                'Здесь ты найдёшь наши воспоминания, комплименты и многое другое. ' +
                'Выбери, что хочешь узнать или получить:',
            { parse_mode: 'Markdown' }
        );

        bot.sendMessage(
            chatId,
            '✨ *Что умеет этот бот?* ✨\n\n' +
                '❤️ *Сколько мы вместе?* — Узнай, сколько времени мы уже вместе, до секунды!\n' +
                '💌 *Факты о нас* — Вспомним наши лучшие моменты и истории, которые сделали нас такими близкими.\n' +
                '📸 *Фотки наши* — Наши самые тёплые и яркие фото, которые хранят нашу любовь.\n' +
                '👏 *Комплименты красотке на каждый день* — Получи порцию нежности и восхищения тобой!\n\n' +
                'Выбери, что хочешь узнать или получить:',
            { parse_mode: 'Markdown', reply_markup: keyboard.reply_markup }
        );
    });
});

bot.onText(/❤️ Сколько мы вместе\?/, (msg) => {
    const chatId = msg.chat.id;
    const now = new Date();
    const delta = now - START_DATE;

    const totalSeconds = Math.floor(delta / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = Math.floor(totalDays / 30);
    const totalYears = Math.floor(totalDays / 365);

    const text =
        `💕 *Мы вместе уже:* 💕\n\n` +
        `🌹 *${totalYears} года — столько лет я счастлив каждым днём, проведённым с тобой.\n` +
        `🌸 *${totalMonths} месяцев — столько месяцев я наслаждаюсь твоей улыбкой и теплом.\n` +
        `🌺 *${totalWeeks} недель — столько недель я благодарен за каждое мгновение рядом с тобой.\n` +
        `🌼 *${totalDays} дней — столько дней я просыпаюсь с мыслью о тебе.\n` +
        `🌷 *${totalHours} часов — столько часов я мечтаю о наших будущих приключениях.\n` +
        `🌻 *${totalMinutes} минут — столько минут я восхищаюсь твоей красотой.\n` +
        `🌞 *${totalSeconds} секунд — столько секунд я чувствую, как бьётся моё сердце для тебя.\n\n` +
        `И знаешь, что самое прекрасное? С каждой секундой моя любовь к тебе становится только сильнее. ` +
        `Ты — моя Вселенная, и я счастлив, что мы вместе. ❤️\n\n` +
        `Спасибо, что ты есть у меня, Эля. Ты делаешь мою жизнь настоящей сказкой. 🫶`;

    bot.sendMessage(chatId, text);
});

bot.onText(/💌 Факты о нас/, (msg) => {
    const chatId = msg.chat.id;
    userFactsProgress[chatId] = 0;

    bot.sendMessage(
        chatId,
        "Сейчас будут факты про нас! Внимательно читай и нажимай 'Продолжить➡️', чтобы увидеть следующий факт про нас🤍"
    );

    sendFact(chatId);
});

bot.onText(/Продолжить➡️/, (msg) => {
    const chatId = msg.chat.id;

    if (userFactsProgress[chatId] !== undefined) {
        userFactsProgress[chatId]++;
        sendFact(chatId);
    } else {
        bot.sendMessage(
            chatId,
            "Нажми '💌 Факты о нас', чтобы начать сначала!"
        );
    }
});

function sendFact(chatId) {
    const factIndex = userFactsProgress[chatId];

    if (factIndex >= factsWithImages.length) {
        fs.readFile(path.join(__dirname, 'images/18.jpg'), (err, data) => {
            if (err) {
                bot.sendMessage(
                    chatId,
                    'Ошибка при загрузке фотографии. Пожалуйста, попробуйте позже.'
                );
                return;
            }

            bot.sendPhoto(chatId, data);
            bot.sendMessage(
                chatId,
                'Без тебя не было бы всех тех удивительных моментов, которые мы создали вместе. Спасибо, что ты есть, и делаешь нашу историю такой особенной!',
                { reply_markup: keyboard.reply_markup }
            );
        });
        return;
    }

    const factData = factsWithImages[factIndex];
    bot.sendMessage(chatId, factData.fact);

    const media = factData.images.map((image) => ({
        type: 'photo',
        media: fs.createReadStream(path.join(__dirname, image)),
    }));

    bot.sendMediaGroup(chatId, media)
        .then(() => {
            bot.sendMessage(
                chatId,
                "Нажми 'Продолжить➡️', чтобы увидеть следующий факт!",
                { reply_markup: continueKeyboard.reply_markup }
            );
        })
        .catch((err) => {
            bot.sendMessage(
                chatId,
                'Ошибка при загрузке фотографий. Пожалуйста, попробуйте позже.'
            );
        });
}

bot.onText(/📸 Фотки наши/, (msg) => {
    const chatId = msg.chat.id;
    const photoPaths = [
        'images/50.jpg',
        'images/51.jpg',
        'images/53.jpg',
        'images/54.jpg',
        'images/55.jpg',
        'images/56.jpg',
        'images/57.jpg',
        'images/58.jpg',
        'images/59.jpg',
        'images/60.jpg',
    ];

    const media = photoPaths.map((photo) => ({
        type: 'photo',
        media: fs.createReadStream(path.join(__dirname, photo)),
    }));

    bot.sendMediaGroup(chatId, media)
        .then(() => {
            bot.sendMessage(
                chatId,
                'Каждый кадр — это история нашей любви, моменты, которые согревают душу. Мы — две половинки одного сердца, и каждый день с тобой — это волшебство. Пусть эти фото напомнят нам, какие мы счастливые вместе. 💕'
            );
        })
        .catch((err) => {
            bot.sendMessage(
                chatId,
                'Ошибка при загрузке фотографий. Пожалуйста, попробуйте позже.'
            );
        });
});
bot.onText(/👏 Комплименты красотке на каждый день/, (msg) => {
    const chatId = msg.chat.id;
    const compliment =
        compliments[Math.floor(Math.random() * compliments.length)];
    bot.sendMessage(chatId, compliment);
});
