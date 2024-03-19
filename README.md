## Introdution  
This is an exercise in developing a chatbot to work with Open AI. It has been built using NextJS.  
The functionality is quite simple; the user types a question into the input field, hits enter or clicks on the arrow head to the right and a response is received from Open AI.  
In the large window above, the back-and-forth conversation between user and Open AI is displayed and can be scrolled. There is also a copy-to-clipboard feature to the side of each of the messages.

## Tech Stack  
NextJS v14  
TypeScript  
Tailwindcss  
Useful component libraries - [shadcn/ui](https://ui.shadcn.com/) which gets some its components from [radix UI](https://www.radix-ui.com/)  
[Clerk](https://clerk.com/docs) for authentication and management of users  
useChat hook from [Vercel AI SDK](https://sdk.vercel.ai/docs/api-reference/use-chat#usechat) which allows us to work with AI models  
[OpenAI text generation model](https://platform.openai.com/docs/guides/text-generation)


## Overview  
### OpenAI
Use the OpenAI model by installing the OpenAI SDK   
![image](https://github.com/johnhm22/ai-chatbot-nextjs/assets/71333679/ea024c74-a51d-40bc-a7b5-e72ea8cebfbb)  

Create a client  
![image](https://github.com/johnhm22/ai-chatbot-nextjs/assets/71333679/e09020e5-92d0-4001-8dfc-d84f12a21ce7)

We can then call different endpoints such as the Chat Completions api shown below.
![image](https://github.com/johnhm22/ai-chatbot-nextjs/assets/71333679/3acfef6b-6132-4dd4-847a-c244196b7fd5)  

Check out the OpenAI docs for a detailed explanation  
[OpenAI](https://platform.openai.com/docs/guides/text-generation/chat-completions-api?lang=node.js)  

### [Clerk](https://clerk.com/)  
Clerk provides an authentication solution for a number of frameworks including Next.js  

ClerkProvider in imported into the layout.tsx file and used to wrap the components so it is made available to the app.  

![image](https://github.com/johnhm22/ai-chatbot-nextjs/assets/71333679/2c99fcad-64ec-41aa-b5b1-ba18d57c0a67)  

A number of helpers/methods are made available by Clerk.  

The authMiddleware helper is exported from a middleware.ts file. In this file we can define which routes we want Clerk to check for authorisation credentials.  So, for these routes, a user who is not signed in is blocked by authMiddleware from accessing them.  

In this app, we following from Clerk are used:  
* The SignInButton which, when clicked, takes the user to the sign-in page or presents a sign-in modal. In this app, we have customised the SignInButton component by using it to wrap our own Button component.  
* SignedIn - this is a useful component that checks the authentication of a user. Children wrapped by SignedIn will only be rendered if the user has an active session. So ideal for displaying the appropriate menu in a header.  
* SignedOut -  similar to the SignedIn component, but only renders children if the user is not signed in.
* UserButton
* clerkClient  
By calling clerkClient.users user data is exposed and can be interrogated and updated.  
In the app, clerkClient.users.updateUserMetaData() is employed to update data held about the user.  As an example, updateUserMetaData is used to manage the number of credits held by the user; decreasing the credits for each AI question and holding Stripe payment details are two uses.   
* currentUser - this is a helper that returns an object with the current user details. It is asynchronous and needs to be called with await and the returned object saved in a constant
* useClerk - the following two helpers can be destrucutred when calling useClerk()  
openSignIn - this will open the SignIn component
session - this is destructured from useClerk(). It is an object containing information about the current user session. There are a number of properties such as a unique id for a particular session and also status which has several properties, for example active, expired, ended etc.

This is the session printed to the console:  
 ![image](https://github.com/johnhm22/ai-chatbot-nextjs/assets/71333679/28d0153a-ccb9-483a-aafd-db7543062e75)  

* useUser - as the clear docs say, a hook that is "a convenient way to access the current User data where you need it."

When not signed-in
* ![image](https://github.com/johnhm22/ai-chatbot-nextjs/assets/71333679/559159a7-fdfd-4d72-beab-df3557cf31a5)

When signed-in
* ![image](https://github.com/johnhm22/ai-chatbot-nextjs/assets/71333679/cbd80364-4f81-4820-bc65-ca6899d70e39)  










### Reference  
Hamed Bahram - author of some greate tutorials  
https://www.youtube.com/watch?v=YKpA0JG8wTk






