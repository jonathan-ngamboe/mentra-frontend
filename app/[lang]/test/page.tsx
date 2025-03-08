import WordScroller from '@/components/WordScroller';

export default function Test() {
  const words = [
    { text: 'Hello', link: '#' },
    { text: 'World', link: '#' },
    { text: 'This', link: '#' },
    { text: 'Is', link: '#' },
    { text: 'A', link: '#' },
    { text: 'Test', link: '#' },
  ];

  return (
    <>
      <header className='min-h-[100vh] flex w-full place-items-center px-5rem'>
        <h1 className="fluid">
          you can<br />scroll.
        </h1>
      </header>
      <WordScroller words={words} endWord="End" />
    </>
  );
}