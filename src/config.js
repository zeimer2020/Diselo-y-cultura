export const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
export const lerp = (a,b,t) => a+(b-a)*t;
export const NOTES = [196,220,261.63,293.66,329.63];
export const CHAPTERS = [
  {number:'01', title:'Llegar sin conocer a nadie.', flavor:'El primer sorbo es intenso.', line:'Las luces, las voces, el hielo. Todo parece ir más rápido que tú.'},
  {number:'02', title:'No hace falta seguir a nadie.', flavor:'Aparece algo dulce.', line:'Puedes acercarte, tomar distancia o quedarte. Tu ritmo también cabe aquí.'},
  {number:'03', title:'El lugar no cambió. Tú sí.', flavor:'El hielo cede. El sabor se suaviza.', line:'Quizá para eso valía la pena: para darte tiempo de encontrar tu manera de estar.'},
];
