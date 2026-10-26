// Confirmed business identity. Never put a private verification address here.
export const studioIdentity={
 '@type':'Organization','@id':'https://brandnamechanges.com/#studio',name:'BNC Studio',legalName:'Brand Name Changes Ltd',alternateName:'Brand Name Changes',url:'https://brandnamechanges.com/',email:'brandnamechanges@gmail.com',telephone:'+447477774432',
 identifier:{'@type':'PropertyValue',propertyID:'UK company number',value:'17297548'},
 address:{'@type':'PostalAddress',addressLocality:'Bristol',addressCountry:'GB'},
 areaServed:[{'@type':'City',name:'Bristol'},{'@type':'City',name:'London'}],
 description:'A Bristol software studio building websites, booking systems, business software and integrations for clients in Bristol, London and remotely.'
};
export const localServices=[{
 slug:'bristol',city:'Bristol',title:'Web design & software development in Bristol | BNC Studio',
 description:'Bristol-based BNC Studio builds business websites, booking systems, online shops and custom software. Meet in person or work remotely. Start with a free video mock-up.',
 heading:'A Bristol studio.<br>Software for your business.',
 intro:'We’re based in Bristol. We build websites and the tools behind them for businesses that need customers to book, buy or get in touch, and teams that need a simpler way to work.',
 meeting:'We can meet in person by arrangement or work remotely. Start by telling us what happens between a customer finding you and the work getting done.',
 section:'From a local enquiry to a working business.',
 cases:[['A website that earns the next conversation.','Make the service, location and next step clear on a phone. Bring the contact form, booking or quote request into the same journey.'],['Bookings without the extra phone call.','For a salon, clinic, class or hospitality business: let someone choose the service, see an available time and understand what happens next. We can work with your existing booking provider.'],['A clearer working day.','For service teams: connect incoming enquiries, job information, invoices and follow-ups. Start with the repeated handoff that costs the most time.']],
 questions:[['Can we meet in Bristol?','Yes, in-person meetings are available by arrangement. Contact us first to organise a suitable time and place.'],['Can you improve a site we already have?','Yes. Tell us what is getting in the way: confusing enquiries, a difficult booking journey or a slow mobile page. We can review that specific problem before agreeing a rebuild.'],['What happens after the first conversation?','We offer a short video mock-up at no cost and with no obligation. If you want to proceed, we agree the scope, timeline and fixed price before building.']]
},{
 slug:'london',city:'London',title:'Websites & custom software for London businesses | BNC Studio',
 description:'Websites, client portals, booking systems and custom software for London businesses from a Bristol-based studio. Remote collaboration and in-person meetings by arrangement.',
 heading:'For London businesses.<br>A clear route to a useful build.',
 intro:'We work with London businesses remotely and in person by arrangement. BNC Studio is based in Bristol: you work directly with the studio building your website, portal or business software.',
 meeting:'Remote reviews keep decisions and working versions easy to share. When a conversation needs to happen in person, we can arrange a meeting in London.',
 section:'Connect the front of the business to the work behind it.',
 cases:[['A customer journey that stays together.','Connect your marketing site with the booking, payment or enquiry step. Keep the information people need close to the decision, and work with the tools you already use where they fit.'],['A portal your customers can use.','Bring project updates, documents and next actions into one clear place. Agree the access rules and the information each customer should see before choosing an implementation.'],['Tools for a team working across locations.','Replace repeated copying between forms, spreadsheets and a CRM with a deliberate workflow. We can build the missing integration or a focused internal tool, with human review where it matters.']],
 questions:[['Are you based in London?','We are based in Bristol and serve London businesses. We offer remote collaboration and in-person meetings by arrangement.'],['How do remote builds work?','We agree the scope and next decisions, then share small working releases you can review. Feedback stays attached to something you can see and try, instead of waiting for a final reveal.'],['Can you work alongside our existing team or supplier?','Yes. Infrastructure, integrations and embedded engineering are part of our offer. We can scope a particular handoff or missing component rather than replace a system that already works.']]
}];
export function studioSchema({path='/',local=null}={}){
 const graph=[studioIdentity,{'@type':'WebPage','@id':`https://brandnamechanges.com${path}#page`,url:`https://brandnamechanges.com${path}`,about:{'@id':studioIdentity['@id']}}];
 if(local){
  graph.push({'@type':'Service','@id':`https://brandnamechanges.com${path}#service`,name:`Websites and custom software for ${local.city} businesses`,serviceType:['Website development','Custom software development','Business systems integration'],provider:{'@id':studioIdentity['@id']},areaServed:{'@type':'City',name:local.city},url:`https://brandnamechanges.com${path}`});
  graph.push({'@type':'BreadcrumbList',itemListElement:[['Studio','/'],['Work with us','/work-with-us/'],[local.city,path]].map(([name,url],i)=>({'@type':'ListItem',position:i+1,name,item:'https://brandnamechanges.com'+url}))});
 }
 return {'@context':'https://schema.org','@graph':graph};
}
export const localLinks='<nav class="studio-local-links" aria-label="Where we work"><span>BNC Studio is based in Bristol. Working with businesses in London and remotely.</span><a href="/work-with-us/bristol/">Bristol services ↗</a><a href="/work-with-us/london/">London services ↗</a><a href="tel:+447477774432">07477 774432</a></nav>';
