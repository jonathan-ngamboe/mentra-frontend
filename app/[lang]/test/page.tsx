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
    <div>
      <WordScroller words={words} endWord="End" />
    </div>
  );
}
