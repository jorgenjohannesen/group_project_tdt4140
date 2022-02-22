const Hike = ({ hike }) => {
    const {
      attributes: { description },
    } = hike;
  
    return (
      <div>{description}</div>
    );
  };
  
  export const getServerSideProps = async (context) => {
    const id = context.query.id;
  
    const response = await fetch(`http://localhost:1337/api/hikes/${id}`);
  
    const result = await response.json();
    const hike = result.data;
  
    return {
      props: { hike },
    };
  };
  
  export default Hike;
  