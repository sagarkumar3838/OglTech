-- Delete existing Java Basic questions (they have wrong answers)
DELETE FROM practice_questions 
WHERE skill = 'Java' AND level = 'Basic';

-- Insert correct Java Basic questions from CSV
-- The CSV has correct_answer as letters (A, B, C, D) which our code now handles

INSERT INTO practice_questions (skill, level, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, mdn_link, youtube_english, youtube_hindi, youtube_kannada, youtube_tamil, youtube_telugu, topic)
VALUES
('Java', 'Basic', 'Which component actually executes the bytecode after compilation?', 'JRE', 'JDK', 'JVM', 'JAR', 'C', 'JVM (Java Virtual Machine) is responsible for executing bytecode', 'https://docs.oracle.com/javase/specs/jvms/se21/html/index.html', 'https://youtube.com/results?search_query=jvm+bytecode+execution', 'https://youtube.com/results?search_query=jvm+hindi', 'https://youtube.com/results?search_query=jvm+kannada', 'https://youtube.com/results?search_query=jvm+tamil', 'https://youtube.com/results?search_query=jvm+telugu', 'Basics'),

('Java', 'Basic', 'Select the correct command to compile Hello.java file', 'java Hello.java', 'javac Hello', 'javac Hello.java', 'java Hello', 'C', 'javac is the compiler and it takes .java file as input', 'https://docs.oracle.com/javase/tutorial/getStarted/application/index.html', 'https://youtube.com/results?search_query=compile+java+command', 'https://youtube.com/results?search_query=compile+java+hindi', 'https://youtube.com/results?search_query=compile+java+kannada', 'https://youtube.com/results?search_query=compile+java+tamil', 'https://youtube.com/results?search_query=compile+java+telugu', 'Basics'),

('Java', 'Basic', 'Identify the file extension produced after successful javac command', '.java', '.class', '.jar', '.exe', 'B', 'Compiled Java source produces .class (bytecode) files', 'https://docs.oracle.com/javase/tutorial/getStarted/application/index.html', 'https://youtube.com/results?search_query=java+class+file', 'https://youtube.com/results?search_query=java+class+file+hindi', 'https://youtube.com/results?search_query=java+class+file+kannada', 'https://youtube.com/results?search_query=java+class+file+tamil', 'https://youtube.com/results?search_query=java+class+file+telugu', 'Basics'),

('Java', 'Basic', 'Which access modifier allows members to be visible only within the same class?', 'public', 'protected', 'default', 'private', 'D', 'private members are accessible only inside the same class', 'https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html', 'https://youtube.com/results?search_query=java+private+modifier', 'https://youtube.com/results?search_query=private+access+hindi', 'https://youtube.com/results?search_query=private+access+kannada', 'https://youtube.com/results?search_query=private+access+tamil', 'https://youtube.com/results?search_query=private+access+telugu', 'Basics'),

('Java', 'Basic', 'Choose the valid way to create a String object in Java', 'String s = ''hello'';', 'String s = new String(hello);', 'String s = "hello";', 'String s = hello;', 'C', 'Double quotes are used for string literals', 'https://docs.oracle.com/javase/tutorial/java/data/strings.html', 'https://youtube.com/results?search_query=java+string+creation', 'https://youtube.com/results?search_query=string+creation+hindi', 'https://youtube.com/results?search_query=string+creation+kannada', 'https://youtube.com/results?search_query=string+creation+tamil', 'https://youtube.com/results?search_query=string+creation+telugu', 'Basics'),

('Java', 'Basic', 'Which keyword is used to prevent method overriding in a child class?', 'static', 'final', 'abstract', 'override', 'B', 'final methods cannot be overridden', 'https://docs.oracle.com/javase/tutorial/java/IandI/final.html', 'https://youtube.com/results?search_query=final+keyword+java', 'https://youtube.com/results?search_query=final+keyword+hindi', 'https://youtube.com/results?search_query=final+keyword+kannada', 'https://youtube.com/results?search_query=final+keyword+tamil', 'https://youtube.com/results?search_query=final+keyword+telugu', 'Basics'),

('Java', 'Basic', 'What happens if you try to compile a file without a public class matching the filename?', 'It compiles successfully', 'Compilation error', 'Runtime error', 'Warning only', 'B', 'Public class name must match the .java filename', 'https://docs.oracle.com/javase/tutorial/getStarted/application/index.html', 'https://youtube.com/results?search_query=java+filename+public+class', 'https://youtube.com/results?search_query=public+class+filename+hindi', 'https://youtube.com/results?search_query=public+class+filename+kannada', 'https://youtube.com/results?search_query=public+class+filename+tamil', 'https://youtube.com/results?search_query=public+class+filename+telugu', 'Basics'),

('Java', 'Basic', 'Select the correct signature of the main method', 'public static void main()', 'static public void main(String args)', 'public static void main(String[] args)', 'void public static main(String args[])', 'C', 'This is the only correct signature JVM looks for', 'https://docs.oracle.com/javase/tutorial/getStarted/application/index.html', 'https://youtube.com/results?search_query=java+main+method+signature', 'https://youtube.com/results?search_query=main+method+hindi', 'https://youtube.com/results?search_query=main+method+kannada', 'https://youtube.com/results?search_query=main+method+tamil', 'https://youtube.com/results?search_query=main+method+telugu', 'Basics'),

('Java', 'Basic', 'Which loop guarantees at least one execution even if condition is false?', 'for', 'while', 'do-while', 'enhanced for', 'C', 'do-while executes body first, then checks condition', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/while.html', 'https://youtube.com/results?search_query=do+while+java', 'https://youtube.com/results?search_query=do+while+hindi', 'https://youtube.com/results?search_query=do+while+kannada', 'https://youtube.com/results?search_query=do+while+tamil', 'https://youtube.com/results?search_query=do+while+telugu', 'Basics'),

('Java', 'Basic', 'Identify the operator that returns remainder after division', '/', '*', '%', '//', 'C', '% is the modulus (remainder) operator', 'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/operators.html', 'https://youtube.com/results?search_query=modulus+operator+java', 'https://youtube.com/results?search_query=modulus+hindi', 'https://youtube.com/results?search_query=modulus+kannada', 'https://youtube.com/results?search_query=modulus+tamil', 'https://youtube.com/results?search_query=modulus+telugu', 'Basics');

-- Verify the upload
SELECT COUNT(*) as total_questions FROM practice_questions WHERE skill = 'Java' AND level = 'Basic';

-- Show first 5 questions to verify
SELECT 
  id,
  LEFT(question_text, 50) as question,
  correct_answer,
  option_a,
  option_b,
  option_c,
  option_d
FROM practice_questions 
WHERE skill = 'Java' AND level = 'Basic'
LIMIT 5;
