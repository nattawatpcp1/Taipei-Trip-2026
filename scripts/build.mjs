import {mkdir,rm,cp} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist');
for(const file of ['index.html','src','public','sw.js']) await cp(file,`dist/${file}`,{recursive:true});
console.log('Built static app → dist/');
