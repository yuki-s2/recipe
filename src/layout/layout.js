const Layout = ({children}) => {

    return (
        <>
            <header>
                <h1 className='page_ttl'>ページタイトル</h1>
            </header>
            <main>
               {children}
            </main>
        </>
    );
};

export default Layout;