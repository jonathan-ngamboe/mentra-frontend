import WordScroller from '@/components/WordScroller';

export default async function Test() {
  const words = [
    { text: 'Hello', link: '#' },
    { text: 'World', link: '#' },
    { text: 'This', link: '#' },
    { text: 'Is', link: '#' },
    { text: 'A', link: '#' },
    { text: 'Test', link: '#' },
  ];

  return (
    <div className='grid place-items-center'>
      <header className='min-h-[100vh] flex w-full place-items-center px-5rem'>
        <h1>
          you can
          <br />
          scroll.
        </h1>
      </header>
      <WordScroller words={words} endWord="End" />
    </div>
  );
}
