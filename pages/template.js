// TEMPLATE FOR DEFAULT LAYOUT
// PLEASE EDIT LAYOUR IN ../components/layout


import Layout from '../components/layout';
export default function Page(){
    return (
        <>

        </>
        )

}

Page.getLayout = function getLayout(page) {
    return (
      <Layout>
        {page}
      </Layout>
    )
  }