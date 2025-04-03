declare module '*.csv' {
  const content: {
    Word: string;
    IPA: string;
    English: string;
    Spanish: string;
    Tone_Melody: string;
  }[];
  export default content;
}