import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '@clerk/clerk-expo';

const questions = [

  { 
    question: 'What is phishing?', 
    options: ['Fake emails/websites to steal data', 'A fishing hobby', 'Secure login method', 'App update process'], 
    correct: 0, 
    explanation: 'Phishing uses deception to trick you into revealing sensitive information like passwords.' 
  },
  { 
    question: 'Which is a common phishing red flag?', 
    options: ['HTTPS in the URL', 'Unexpected email attachments', 'Official company domain', 'Clear contact info'], 
    correct: 1, 
    explanation: 'Unexpected attachments often contain malware; always verify the sender.' 
  },
  { 
    question: 'What does 2FA stand for and protect against?', 
    options: ['Two-Factor Authentication; password theft', 'Two-Fish Attack; viruses', 'Second File Access; data loss', 'Two-Factor Approval; nothing'], 
    correct: 0, 
    explanation: '2FA adds a second verification step, protecting even if your password is compromised.' 
  },
  { 
    question: 'What is a phishing URL often like?', 
    options: ['bankofamerica.com', 'bаnkofamerica.com (with fake letters)', 'https://secure-bank.com', 'appstore.com'], 
    correct: 1, 
    explanation: 'Phishers use lookalike characters (homoglyphs) to mimic legitimate sites.' 
  },
  { 
    question: 'Ransomware does what?', 
    options: ['Encrypts files and demands payment', 'Sends spam emails', 'Blocks ads', 'Updates software'], 
    correct: 0, 
    explanation: 'Ransomware locks your data until you pay; prevention includes backups and caution with downloads.' 
  },
  { 
    question: 'Spear-phishing targets?', 
    options: ['Everyone randomly', 'Specific individuals/companies', 'Only large corporations', 'Social media only'], 
    correct: 1, 
    explanation: 'Spear-phishing is personalized, making it harder to spot than mass phishing.' 
  },
  { 
    question: 'How to spot email phishing?', 
    options: ['Check sender email domain', 'Click all links', 'Share info if urgent', 'Ignore spelling errors'], 
    correct: 0, 
    explanation: 'Verify the sender\'s domain matches the official one; hover over links to see real URL.' 
  },
  { 
    question: 'What is a smishing attack?', 
    options: ['SMS phishing via text messages', 'Social media hacking', 'Smartphone virus', 'Small phishing scam'], 
    correct: 0, 
    explanation: 'Smishing uses fake texts to trick you into clicking malicious links or sharing info.' 
  },
  { 
    question: 'Why avoid URL shorteners in suspicious links?', 
    options: ['They hide the real destination', 'They are always safe', 'They speed up loading', 'They encrypt data'], 
    correct: 0, 
    explanation: 'Shorteners like bit.ly can mask phishing sites; expand or avoid if unsure.' 
  },
  { 
    question: 'Best practice after spotting phishing?', 
    options: ['Click to verify', 'Report to authorities/company', 'Share with friends', 'Ignore it'], 
    correct: 1, 
    explanation: 'Reporting helps stop the attack and protects others; never engage with suspicious content.' 
  }

];

export default function Quiz() {
  const { isLoaded, user } = useUser();

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  useEffect(() => {
    loadHighScore();
  }, []);

  const loadHighScore = async () => {
    try {
      const saved = await AsyncStorage.getItem('quizHighScore');
      if (saved) setHighScore(parseInt(saved));
    } catch (error) {
      console.error('Failed to load high score:', error);
    }
  };

  const saveHighScore = async (newScore) => {
    if (newScore > highScore) {
      setHighScore(newScore);
      try {
        await AsyncStorage.setItem('quizHighScore', newScore.toString());
      } catch (error) {
        console.error('Failed to save high score:', error);
      }
    }
  };

  // New: function to send quiz score email to user
  const sendScoreEmail = async (finalScore, totalQuestions, email) => {
    if (!email) return;
    try {
      const response = await fetch('https://protectit-backend-devis-projects-d516985b.vercel.app/api/send-score-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, score: finalScore, total: totalQuestions }),
      });
      const data = await response.json();
      if (!data.success) {
        Alert.alert('Failed to send congratulations email.');
      }
    } catch (error) {
      Alert.alert('Error sending email.');
      console.error('Email send error:', error);
    }
  };

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    const isCorrect = index === questions[current].correct;
    if (isCorrect) setScore(score + 1);

    Alert.alert(isCorrect ? 'Correct!' : 'Incorrect!', isCorrect ? 'Good job!' : questions[current].explanation, [
      { text: 'Next', onPress: nextQuestion },
    ]);
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      const finalScore = score + (selectedAnswer === questions[current].correct ? 1 : 0);
      setShowResult(true);
      saveHighScore(finalScore);
      if (user?.primaryEmailAddress?.emailAddress) {
        sendScoreEmail(finalScore, questions.length, user.primaryEmailAddress.emailAddress);
      }
    }
  };

  const resetQuiz = () => {
    setCurrent(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
  };

  const question = questions[current];

  if (showResult) {
    return (
      <View style={styles.container}>
        {isLoaded && user && <Text style={styles.welcome}>Welcome back, {user.primaryEmailAddress?.emailAddress || 'User'}! 👋</Text>}

        <Text style={styles.title}>Quiz Complete!</Text>
        <Text style={styles.score}>Your Score: {score} / {questions.length}</Text>
        <Text style={styles.highScore}>High Score: {highScore} / {questions.length}</Text>
        <Text style={styles.feedback}>
          {score / questions.length > 0.7 ? "Excellent! You're well-prepared against phishing." : 'Good effort! Review the explanations to learn more.'}
        </Text>
        <TouchableOpacity style={styles.button} onPress={resetQuiz}>
          <Text style={styles.buttonText}>Restart Quiz</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isLoaded && user && <Text style={styles.welcome}>Welcome back, {user.primaryEmailAddress?.emailAddress || 'User'}! 👋</Text>}

      <Text style={styles.progress}>Question {current + 1} / {questions.length}</Text>
      <Text style={styles.question}>{question.question}</Text>

      {question.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.option,
            selectedAnswer !== null && index === selectedAnswer && styles.selectedOption,
            selectedAnswer !== null && index === question.correct && styles.correctOption,
          ]}
          onPress={() => selectedAnswer === null && handleAnswer(index)}
          disabled={selectedAnswer !== null}
        >
          <Text
            style={[
              styles.optionText,
              selectedAnswer !== null && index === selectedAnswer && { fontWeight: 'bold' },
              selectedAnswer !== null && index === question.correct && { color: '#34C759' },
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa', justifyContent: 'center' },
  welcome: { fontSize: 22, fontWeight: 'bold', color: '#007AFF', textAlign: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#007AFF', marginBottom: 20 },
  score: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, color: '#007AFF' },
  highScore: { fontSize: 18, textAlign: 'center', marginBottom: 20, color: '#666' },
  feedback: { fontSize: 16, textAlign: 'center', marginBottom: 30, color: '#333' },
  progress: { fontSize: 16, textAlign: 'center', marginBottom: 20, color: '#666' },
  question: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  option: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  selectedOption: { backgroundColor: '#E8F5E8' },
  correctOption: { backgroundColor: '#E8F5E8', borderColor: '#34C759', borderWidth: 2 },
  optionText: { fontSize: 16, color: '#333' },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});