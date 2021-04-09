import '@styles/globals.css'
import 'tailwindcss/tailwind.css'

function MyApp(props: { Component:any, pageProps:any }) {
  return <props.Component {...props.pageProps} />
}

export default MyApp
