import os
import telebot
import datetime
import random
from telebot.types import ReplyKeyboardMarkup, KeyboardButton, InputMediaPhoto
from dotenv import load_dotenv
from data import compliments,facts_with_images


load_dotenv()

TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

START_DATE = datetime.datetime(2023, 1, 19)  

bot = telebot.TeleBot(TOKEN)

user_facts_progress = {}


keyboard = ReplyKeyboardMarkup(resize_keyboard=True)
keyboard.add(
    KeyboardButton("❤️ Сколько мы вместе?"),
    KeyboardButton("💌 Факты о нас")
)
keyboard.add(
    KeyboardButton("📸 Фотки наши"), KeyboardButton("👏 Комплименты красотке на каждый день")
)
continue_keyboard = ReplyKeyboardMarkup(resize_keyboard=True)
continue_keyboard.add(KeyboardButton("Продолжить➡️"))  


@bot.message_handler(commands=['start'])
def send_welcome(message):
    try:
        with open("images/62.jpg", "rb") as photo:
            bot.send_photo(message.chat.id, photo)

        # Красивое поздравление с Днём святого Валентина
        bot.send_message(
            message.chat.id,
            "💌 *С Днём святого Валентина, моя любимая Эля!* 💌\n\n"
            "Сегодня особенный день — день, когда весь мир говорит о любви. Но знаешь, что? "
            "Для меня каждый день — это день любви к тебе. Ты — моё солнце, моё вдохновение и моё счастье. "
            "Спасибо, что ты есть в моей жизни. Ты делаешь её ярче, теплее и прекраснее. "
            "Я бесконечно благодарен за каждую улыбку, за каждый момент, проведённый вместе. "
            "Ты — моя Валентинка на всю жизнь. ❤️\n\n"
            "Я создал этого бота, чтобы напоминать тебе, как ты важна для меня. "
            "Здесь ты найдёшь наши воспоминания, комплименты и многое другое. "
            "Выбери, что хочешь узнать или получить:",
            parse_mode="Markdown"
        )

        # Описание функционала бота
        bot.send_message(
            message.chat.id,
            "✨ *Что умеет этот бот?* ✨\n\n"
            "❤️ *Сколько мы вместе?* — Узнай, сколько времени мы уже вместе, до секунды!\n"
            "💌 *Факты о нас* — Вспомним наши лучшие моменты и истории, которые сделали нас такими близкими.\n"
            "📸 *Фотки наши* — Наши самые тёплые и яркие фото, которые хранят нашу любовь.\n"
            "👏 *Комплименты красотке на каждый день* — Получи порцию нежности и восхищения тобой!\n\n"
            "Выбери, что хочешь узнать или получить:",
            parse_mode="Markdown",
            reply_markup=keyboard
        )
    except Exception as e:
        bot.send_message(message.chat.id, "Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.")

@bot.message_handler(func=lambda message: message.text == "❤️ Сколько мы вместе?")
def send_time_together(message):
    try:
        now = datetime.datetime.now()
        delta = now - START_DATE

        total_seconds = int(delta.total_seconds())
        total_minutes = total_seconds // 60
        total_hours = total_minutes // 60
        total_days = delta.days
        total_weeks = total_days // 7
        total_months = total_days // 30  
        total_years = total_days // 365  

        text = (
            f"💕 *Мы вместе уже:* 💕\n\n"
            f"🌹 *{total_years} года — столько лет я счастлив каждым днём, проведённым с тобой.\n"
            f"🌸 *{total_months} месяцев — столько месяцев я наслаждаюсь твоей улыбкой и теплом.\n"
            f"🌺 *{total_weeks} недель — столько недель я благодарен за каждое мгновение рядом с тобой.\n"
            f"🌼 *{total_days} дней — столько дней я просыпаюсь с мыслью о тебе.\n"
            f"🌷 *{total_hours} часов — столько часов я мечтаю о наших будущих приключениях.\n"
            f"🌻 *{total_minutes} минут — столько минут я восхищаюсь твоей красотой.\n"
            f"🌞 *{total_seconds} секунд — столько секунд я чувствую, как бьётся моё сердце для тебя.\n\n"
            f"И знаешь, что самое прекрасное? С каждой секундой моя любовь к тебе становится только сильнее. "
            f"Ты — моя Вселенная, и я счастлив, что мы вместе. ❤️\n\n"
            f"Спасибо, что ты есть у меня, Эля. Ты делаешь мою жизнь настоящей сказкой. 🫶"
        )

        bot.send_message(message.chat.id, text)
    except Exception as e:
        bot.send_message(message.chat.id, "Ошибка при расчете времени. Пожалуйста, попробуйте позже.")



@bot.message_handler(func=lambda message: message.text == "💌 Факты о нас")
def send_first_fact(message):
    user_facts_progress[message.chat.id] = 0  
    bot.send_message(
        message.chat.id, 
        "Сейчас будут факты про нас! Внимательно читай и нажимай 'Продолжить➡️', чтобы увидеть следующий факт про нас🤍"
    )
    send_fact(message)

@bot.message_handler(func=lambda message: message.text == "Продолжить➡️")
def send_next_fact(message):
    if message.chat.id in user_facts_progress:
        user_facts_progress[message.chat.id] += 1 
        send_fact(message)
    else:
        bot.send_message(message.chat.id, "Нажми '💌 Факты о нас', чтобы начать сначала!")

def send_fact(message):
    user_id = message.chat.id
    fact_index = user_facts_progress.get(user_id, 0)

    if fact_index >= len(facts_with_images):
        try:
            with open("images/18.jpg", "rb") as photo:
                bot.send_photo(user_id, photo)
            bot.send_message(
                user_id,
                "Без тебя не было бы всех тех удивительных моментов, которые мы создали вместе. Спасибо, что ты есть, и делаешь нашу историю такой особенной!",
                reply_markup=keyboard
            )
        except Exception as e:
            bot.send_message(user_id, "Ошибка при загрузке фотографии. Пожалуйста, попробуйте позже.")
        return

    fact, photo_paths = facts_with_images[fact_index]

    bot.send_message(user_id, fact)

    try:
        photos = [open(path, "rb") for path in photo_paths]
        media = [InputMediaPhoto(photo) for photo in photos]

        bot.send_media_group(user_id, media)
    except Exception as e:
        bot.send_message(user_id, "Ошибка при загрузке фотографий. Пожалуйста, попробуйте позже.")
    finally:
        for photo in photos:
            photo.close()

    bot.send_message(user_id, "Нажми 'Продолжить➡️', чтобы увидеть следующий факт!", reply_markup=continue_keyboard)


@bot.message_handler(func=lambda message: message.text == "📸 Фотки наши")
def send_photos(message):
    photo_paths = [
        "images/50.jpg", "images/51.jpg", "images/53.jpg", "images/54.jpg",
        "images/55.jpg", "images/56.jpg", "images/57.jpg", "images/58.jpg", "images/59.jpg",
        "images/60.jpg"
    ]
    try:
        photos = [open(photo, "rb") for photo in photo_paths]     
        media = [InputMediaPhoto(photo) for photo in photos]
        bot.send_media_group(message.chat.id, media)
        bot.send_message(message.chat.id, "Каждый кадр — это история нашей любви, моменты, которые согревают душу. Мы — две половинки одного сердца, и каждый день с тобой — это волшебство. Пусть эти фото напомнят нам, какие мы счастливые вместе. 💕")
    except Exception as e:
        bot.send_message(message.chat.id, "Ошибка при загрузке фотографий. Пожалуйста, попробуйте позже.")
    finally:
        for photo in photos:
            photo.close()


@bot.message_handler(func=lambda message: message.text == "👏 Комплименты красотке на каждый день")
def send_compliment(message):
    compliment = random.choice(compliments)
    bot.send_message(message.chat.id, compliment)


if __name__ == "__main__":
    bot.polling(none_stop=True)
