import NextLink from "next/link";
import { Box, Flex, Link } from "@chakra-ui/react";
import React from "react";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  return (
    <Flex bg="tomato" p={4}>
      <Box ml={"auto"}>
        <NextLink href="/login">
          <Link color="white" mr={2}>
            login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link color="white">register</Link>
        </NextLink>
      </Box>
    </Flex>
  );
};

export default Navbar;
