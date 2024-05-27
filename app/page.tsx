import Form from "@/components/Form/Form";


export default function Home() {
  return (
    <main className="min-h-screen p-24">  
      <Form minQuestions={3} maxQuestions={5} prompt="Retrieve information about the student for their placement" keyTopics={['age','name']} />
    </main>
  );
}
