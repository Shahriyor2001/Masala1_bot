import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class BotService {
  private bot: TelegramBot;
  private userData = {
    correctAnswer: 0,
    invalidAnswer: 0,
    currentAnswer: 0,
    currentQuestion: '',
  };

  constructor() {
    
    const token = "8123451442:AAFg_l3cvkyQtHBeYQ_ounOnKKS5OGO38VU";
    this.bot = new TelegramBot(token, { polling: true });

    this.bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;

      this.bot.sendMessage(
        chatId,
        `Salom ${msg.chat.first_name}! Misol ishlashni boshladik. Sizga omad tilayman 😊😊😊`,
      );

      this.sendRandomQuestion(chatId);
    });

    this.bot.on('message', (msg) => {
      const chatId = msg.chat.id;

      if (msg.text && !msg.text.startsWith('/')) {
        const userAnswer = parseInt(msg.text.trim());

        if (this.userData.currentAnswer > 0) {
          const correctAnswer = this.calculateAnswer(
            this.userData.currentQuestion,
          );

          if (userAnswer === correctAnswer) {
            this.userData.correctAnswer++;
          } else {
            this.userData.invalidAnswer++;
          }

          if (this.userData.currentAnswer < 10) {
            this.sendRandomQuestion(chatId);
          } else {
            this.bot.sendMessage(
              chatId,
              `Savollar tugadi! To'g'ri javoblar: ${this.userData.correctAnswer} ta, Notog'ri javoblar: ${this.userData.invalidAnswer} ta`,
            );
          }
        }
      }
    });
  }

  private sendRandomQuestion(chatId: number) {
    const operators = ['+', '-', '*', '/'];
    const randomOperator =
      operators[Math.floor(Math.random() * operators.length)];
    const firstRandomNumber = Math.floor(Math.random() * 100);
    const secondRandomNumber = Math.floor(Math.random() * 100);

    this.userData.currentQuestion = `${firstRandomNumber} ${randomOperator} ${secondRandomNumber}`;
    this.userData.currentAnswer++;

    this.bot.sendMessage(chatId, this.userData.currentQuestion);
  }

  private calculateAnswer(question: string): number {
    const [num1, operator, num2] = question.split(' ');

    const n1 = parseInt(num1);
    const n2 = parseInt(num2);

    switch (operator) {
      case '+':
        return n1 + n2;
      case '-':
        return n1 - n2;
      case '*':
        return n1 * n2;
      case '/':
        return Math.floor(n1 / n2);
      default:
        return 0;
    }
  }
}
