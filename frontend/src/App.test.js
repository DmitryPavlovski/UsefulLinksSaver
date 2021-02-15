import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import GroupModal from './components/GroupModal';
import GroupSideBar from './components/GroupSideBar';
import LinkModal from './components/LinkModal';
import LinkItemCollection from './components/LinkItemCollection';

const server = setupServer(
  rest.get('/api/links/', (req, res, ctx) => {
    return res(ctx.json([{id:1,title:"Test",description:"",groupId:null,url:"",createdOn:"2021-02-04T08:02:17.029208Z"}]))
  }),
  rest.get('/api/groups_links/', (req, res, ctx) => {
    return res(ctx.json([{id:1, title:"Test", description:"", createdOn:"2021-02-04T08:02:17.029208Z"}]))
  })
);

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('renders Links app link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Links app/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders Group Item title modal', async () => {
  render(<GroupModal activeItem={{title:""}}/>);
  await waitFor(() => screen.getByText(/Group Item/i));
  expect(screen.getByText(/Group Item/i)).toBeInTheDocument();
});

test('renders group Item for select', async () => {
  render(<LinkModal activeItem={{title:"", url:"", description:"", groupId:""}}/>);
  await waitFor(() => screen.getByText("Test"));  
  expect(screen.getByText("Test")).toBeInTheDocument();
});

test('renders Unsorted li in group list', async () => {
  render(<GroupSideBar
    drop={() => {}} />);
  await waitFor(() => screen.getByText(/Unsorted/i));
  await waitFor(() => screen.getByText(/Test/i));
  expect(screen.getByText(/Unsorted/i)).toBeInTheDocument();
  expect(screen.getByText(/Test/i)).toBeInTheDocument();
});

test('renders Test item  list', async () => {
  render(<LinkItemCollection
    onDragToggle={() => {}}
    activeGroupId={null} />);
  await waitFor(() => screen.getByText("Test"));
  expect(screen.getByText("Test")).toBeInTheDocument();
});
