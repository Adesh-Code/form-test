import Form from "@/components/Form";


export default function Home() {
  return (
    <main className="min-h-screen p-24">  
      <Form maxQuestions={15} context="Retrieve information about the student for their placement" keyTopics={['age','name', 'date of birth', 'year of graduation', 'skills', 'hobbies', 'languages known', 'college of graduation']} />
    </main>
  );
}
