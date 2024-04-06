import { Navbar, Nav, Form, FormControl, Button, Container, NavDropdown } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '../store';
import { addToHistory } from '../lib/userData'; 
import { readToken, removeToken } from '../lib/authenticate'; 

export default function MainNav() {
  const router = useRouter();
  const [searchField, setSearchField] = useState("");
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const [expanded, setExpanded] = useState(false); 
  const token = readToken(); 
  
  const logout = () => {
    setExpanded(false); 
    removeToken(); 
    router.push('/login'); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (searchField.trim() !== "") {
      const queryString = `title=true&q=${encodeURIComponent(searchField.trim())}`;
      try {
        await setSearchHistory(await addToHistory(queryString));
        router.push(`/artwork?${queryString}`);
        setSearchField("");
      } catch (error) {
        console.error('Error adding to history:', error);
      }
    }
  };

  return (
    <Navbar expand="lg" bg="primary" variant="dark" expanded={expanded}>
      <Container>
        <Navbar.Brand href="#">Gaurav Saini</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" onClick={() => setExpanded(!expanded)} />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/" active={router.pathname === '/'}>Home</Nav.Link>
            {token && <Nav.Link href="/search" active={router.pathname === '/search'}>Advanced Search</Nav.Link>}
          </Nav>
          {token && (
            <Form onSubmit={handleSubmit} className="d-flex">
              <FormControl
                type="search"
                placeholder="Search"
                className="me-sm-2"
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
              />
              <Button type="submit" variant="success" className="my-2 my-sm-0">Search</Button>
            </Form>
          )}
          <Nav>
            {token ? ( 
              <NavDropdown title="User Name" id="basic-nav-dropdown">
                <NavDropdown.Item onClick={() => router.push('/favourites')}>Favourites</NavDropdown.Item>
                <NavDropdown.Item onClick={() => router.push('/history')}>History</NavDropdown.Item>
                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : ( 
              <Nav>
                <Nav.Link href="/register" active={router.pathname === '/register'} onClick={() => setExpanded(false)}>Register</Nav.Link>
                <Nav.Link href="/login" active={router.pathname === '/login'} onClick={() => setExpanded(false)}>Login</Nav.Link>
              </Nav>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
